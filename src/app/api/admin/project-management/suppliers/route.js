import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, assertAgentAccess } from '@/lib/project-management';

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') ? Number(searchParams.get('projectId')) : null;
    const search = (searchParams.get('search') || '').trim().toLowerCase();

    // PM Access validation
    const auth = await assertAgentAccess(req, projectId, ['construction', 'payments']);
    if (!auth.allowed) return auth.response;

    // 1. Fetch all registered suppliers (Hub source)
    const registeredRes = await pool.query(`
      SELECT 
        s.id,
        s.shop_name,
        s.business_name,
        s.phone,
        s.city,
        s.state,
        s.status,
        s.is_active,
        TRUE AS is_registered
      FROM suppliers s
      ORDER BY s.shop_name ASC, s.id ASC
    `);

    // 2. Fetch distinct un-registered supplier names used in PM
    const unregRes = await pool.query(`
      SELECT DISTINCT TRIM(supplier_name) AS supplier_name
      FROM (
        SELECT supplier_name FROM pm_material_received 
        WHERE supplier_id IS NULL AND supplier_name IS NOT NULL AND TRIM(supplier_name) != '' AND NOT is_deleted
        UNION
        SELECT supplier_name FROM pm_supplier_payments
        WHERE supplier_id IS NULL AND supplier_name IS NOT NULL AND TRIM(supplier_name) != '' AND NOT is_deleted
      ) combined
      ORDER BY supplier_name ASC
    `);

    const allSuppliers = [
      ...registeredRes.rows.map(r => ({
        id: r.id,
        shop_name: r.shop_name || r.business_name || `Supplier #${r.id}`,
        business_name: r.business_name || '',
        phone: r.phone || '',
        city: r.city || '',
        status: r.status || '',
        is_registered: true,
      })),
      ...unregRes.rows.map((u, idx) => ({
        id: null,
        shop_name: u.supplier_name,
        business_name: '',
        phone: '',
        city: '',
        status: 'unregistered',
        is_registered: false,
      }))
    ];

    // Filter by search if provided
    const filteredAll = search
      ? allSuppliers.filter(s =>
          (s.shop_name && s.shop_name.toLowerCase().includes(search)) ||
          (s.phone && s.phone.includes(search)) ||
          (s.business_name && s.business_name.toLowerCase().includes(search)) ||
          (s.city && s.city.toLowerCase().includes(search))
        )
      : allSuppliers;

    // If no project specified, return all suppliers for global dropdown/search
    if (!projectId || !Number.isInteger(projectId)) {
      return NextResponse.json({
        success: true,
        suppliers: filteredAll,
        allSuppliers: filteredAll,
      });
    }

    // 3. Project-specific supplier aggregation
    // Fetch all non-deleted deliveries for this project
    const deliveriesRes = await pool.query(`
      SELECT 
        r.id,
        r.supplier_id,
        r.supplier_name AS raw_supplier_name,
        s.shop_name,
        s.business_name,
        s.phone,
        s.city,
        r.amount,
        r.received_date
      FROM pm_material_received r
      LEFT JOIN suppliers s ON s.id = r.supplier_id
      WHERE r.project_id = $1 AND NOT r.is_deleted
    `, [projectId]);

    // Fetch all non-deleted payments for this project
    const paymentsRes = await pool.query(`
      SELECT 
        p.id,
        p.supplier_id,
        p.supplier_name AS raw_supplier_name,
        s.shop_name,
        s.business_name,
        s.phone,
        s.city,
        p.amount,
        p.payment_date
      FROM pm_supplier_payments p
      LEFT JOIN suppliers s ON s.id = p.supplier_id
      WHERE p.project_id = $1 AND NOT p.is_deleted
    `, [projectId]);

    const supplierMap = new Map();

    const getSupplierKey = (supplierId, rawName, registeredShop) => {
      if (supplierId) return `reg_${supplierId}`;
      const name = (rawName || registeredShop || 'Unknown Supplier').trim().toLowerCase();
      return `unreg_${name}`;
    };

    // Process deliveries
    for (const d of deliveriesRes.rows) {
      const isReg = Boolean(d.supplier_id);
      const displayName = isReg 
        ? (d.shop_name || d.business_name || d.raw_supplier_name || `Supplier #${d.supplier_id}`)
        : (d.raw_supplier_name || 'Unregistered Supplier');
      const key = getSupplierKey(d.supplier_id, d.raw_supplier_name, d.shop_name);

      if (!supplierMap.has(key)) {
        supplierMap.set(key, {
          key,
          supplier_id: d.supplier_id ? Number(d.supplier_id) : null,
          supplier_name: displayName,
          raw_supplier_name: d.raw_supplier_name || '',
          phone: d.phone || '',
          city: d.city || '',
          is_registered: isReg,
          total_supplied: 0,
          total_paid: 0,
          delivery_count: 0,
          payment_count: 0,
          last_delivery: null,
        });
      }

      const entry = supplierMap.get(key);
      const amt = Number(d.amount) || 0;
      entry.total_supplied += amt;
      entry.delivery_count += 1;
      if (!entry.last_delivery || (d.received_date && d.received_date > entry.last_delivery)) {
        entry.last_delivery = d.received_date;
      }
    }

    // Process payments
    for (const p of paymentsRes.rows) {
      const isReg = Boolean(p.supplier_id);
      const displayName = isReg 
        ? (p.shop_name || p.business_name || p.raw_supplier_name || `Supplier #${p.supplier_id}`)
        : (p.raw_supplier_name || 'Unregistered Supplier');
      const key = getSupplierKey(p.supplier_id, p.raw_supplier_name, p.shop_name);

      if (!supplierMap.has(key)) {
        supplierMap.set(key, {
          key,
          supplier_id: p.supplier_id ? Number(p.supplier_id) : null,
          supplier_name: displayName,
          raw_supplier_name: p.raw_supplier_name || '',
          phone: p.phone || '',
          city: p.city || '',
          is_registered: isReg,
          total_supplied: 0,
          total_paid: 0,
          delivery_count: 0,
          payment_count: 0,
          last_delivery: null,
        });
      }

      const entry = supplierMap.get(key);
      const amt = Number(p.amount) || 0;
      entry.total_paid += amt;
      entry.payment_count += 1;
    }

    const projectSuppliers = Array.from(supplierMap.values()).map(s => {
      const balance = Number((s.total_supplied - s.total_paid).toFixed(2));
      return {
        ...s,
        total_supplied: Number(s.total_supplied.toFixed(2)),
        total_paid: Number(s.total_paid.toFixed(2)),
        balance,
        is_advance: balance < 0,
        balance_due: balance > 0 ? balance : 0,
        advance_amount: balance < 0 ? Math.abs(balance) : 0,
      };
    });

    // Sort by last delivery desc, then balance desc
    projectSuppliers.sort((a, b) => {
      if (b.last_delivery && a.last_delivery) {
        return b.last_delivery.localeCompare(a.last_delivery);
      }
      return (b.last_delivery ? 1 : 0) - (a.last_delivery ? 1 : 0);
    });

    const projectTotals = projectSuppliers.reduce((acc, s) => {
      acc.total_supplied += s.total_supplied;
      acc.total_paid += s.total_paid;
      acc.balance += s.balance;
      return acc;
    }, { total_supplied: 0, total_paid: 0, balance: 0 });

    projectTotals.total_supplied = Number(projectTotals.total_supplied.toFixed(2));
    projectTotals.total_paid = Number(projectTotals.total_paid.toFixed(2));
    projectTotals.balance = Number(projectTotals.balance.toFixed(2));

    return NextResponse.json({
      success: true,
      projectSuppliers,
      projectTotals,
      allSuppliers: filteredAll,
    });
  } catch (error) {
    console.error('Error in PM suppliers route:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch suppliers' }, { status: 500 });
  }
}
