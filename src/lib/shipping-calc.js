/**
 * Pure calculation logic for quantity-based and distance/city shipping rules.
 * Safe to import on both server and client (no database dependencies).
 */

export const DEFAULT_QUANTITY_SHIPPING_RULES = {
  minimum_shipping: 0,
  categories: [
    {
      id: 'cement',
      category: 'Cement',
      unit: 'bag',
      enabled: true,
      cap: 5000,
      max_units_per_trip: 100,
      cities: {
        'Moradabad': { base_charge: 500, extra_unit_rate: 5 },
        'Bareilly': { base_charge: 800, extra_unit_rate: 8 },
      },
    },
    {
      id: 'brick',
      category: 'Brick',
      unit: 'pcs',
      enabled: true,
      cap: 8000,
      max_units_per_trip: 2000,
      cities: {
        'Moradabad': { base_charge: 800, extra_unit_rate: 1 },
        'Bareilly': { base_charge: 1200, extra_unit_rate: 1.5 },
      },
    },
    {
      id: 'steel',
      category: 'Steel',
      unit: 'kg',
      enabled: true,
      cap: 10000,
      max_units_per_trip: 5000,
      cities: {
        'Moradabad': { base_charge: 1000, extra_unit_rate: 2 },
        'Bareilly': { base_charge: 1500, extra_unit_rate: 2.5 },
      },
    },
    {
      id: 'aggregate',
      category: 'Aggregate ( Barjri)',
      unit: 'cft',
      enabled: true,
      cap: 6000,
      max_units_per_trip: 200,
      cities: {
        'Moradabad': { base_charge: 800, extra_unit_rate: 10 },
        'Bareilly': { base_charge: 1200, extra_unit_rate: 15 },
      },
    },
    {
      id: 'sand',
      category: 'Sand',
      unit: 'cft',
      enabled: true,
      cap: 6000,
      max_units_per_trip: 200,
      cities: {
        'Moradabad': { base_charge: 800, extra_unit_rate: 10 },
        'Bareilly': { base_charge: 1200, extra_unit_rate: 15 },
      },
    },
    {
      id: 'timber',
      category: 'Timber ( Lakdi)',
      unit: 'cft',
      enabled: true,
      cap: 5000,
      max_units_per_trip: 100,
      cities: {
        'Moradabad': { base_charge: 500, extra_unit_rate: 15 },
        'Bareilly': { base_charge: 900, extra_unit_rate: 20 },
      },
    },
    {
      id: 'plumbing',
      category: 'plumbing',
      unit: 'meter',
      enabled: true,
      cap: 3000,
      max_units_per_trip: 100,
      cities: {
        'Moradabad': { base_charge: 300, extra_unit_rate: 5 },
        'Bareilly': { base_charge: 500, extra_unit_rate: 8 },
      },
    },
    {
      id: 'electrical',
      category: 'Electrical',
      unit: 'pcs',
      enabled: true,
      cap: 3000,
      max_units_per_trip: 100,
      cities: {
        'Moradabad': { base_charge: 300, extra_unit_rate: 5 },
        'Bareilly': { base_charge: 500, extra_unit_rate: 8 },
      },
    },
  ],
};

export const sameCity = (a, b) =>
  String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

export function normalizeUnit(unit) {
  if (!unit) return '';
  const s = String(unit).trim().toLowerCase().replace(/\.$/, '');
  if (s === 'bags' || s === 'bag') return 'bag';
  if (s === 'pcs' || s === 'pieces' || s === 'piece' || s === 'pc') return 'pcs';
  if (s === 'kgs' || s === 'kg' || s === 'kilogram' || s === 'kilograms') return 'kg';
  if (s === 'cft' || s === 'cu.ft' || s === 'cuft' || s === 'cubic feet') return 'cft';
  if (s === 'meters' || s === 'meter' || s === 'm') return 'meter';
  if (s === 'tons' || s === 'ton') return 'ton';
  if (s === 'quintals' || s === 'quintal') return 'quintal';
  if (s === 'sqft' || s === 'sq.ft' || s === 'square feet') return 'sqft';
  return s.replace(/s$/, '');
}

export function findCityRate(citiesObj, targetCity) {
  if (!citiesObj || typeof citiesObj !== 'object') return null;
  const target = String(targetCity || '').trim().toLowerCase();
  for (const [cityName, rate] of Object.entries(citiesObj)) {
    if (String(cityName).trim().toLowerCase() === target) {
      return rate;
    }
  }
  return null;
}

export function findMatchingRule(item, rules, customerCity) {
  if (!item?.category || !Array.isArray(rules)) return null;
  const itemCat = String(item.category).trim().toLowerCase();
  const itemUnit = normalizeUnit(item.unit || item.order_unit);

  for (const rule of rules) {
    if (rule.enabled === false) continue;
    const ruleCat = String(rule.category || '').trim().toLowerCase();

    // Check category match: exact or clean prefix match (e.g. "Aggregate" and "Aggregate ( Barjri)")
    const cleanRuleCat = ruleCat.split('(')[0].trim();
    const cleanItemCat = itemCat.split('(')[0].trim();
    const isCatMatch =
      ruleCat === itemCat ||
      (cleanRuleCat && cleanItemCat && cleanRuleCat === cleanItemCat) ||
      ruleCat.startsWith(itemCat) ||
      itemCat.startsWith(ruleCat);

    if (!isCatMatch) continue;

    // Check unit mismatch
    const ruleUnit = normalizeUnit(rule.unit);
    if (ruleUnit && itemUnit && ruleUnit !== itemUnit) {
      // Unit mismatch!
      continue;
    }

    // Check city entry
    const cityRate = findCityRate(rule.cities, customerCity);
    if (!cityRate || !Number.isFinite(Number(cityRate.base_charge)) || Number(cityRate.base_charge) < 0) {
      // Missing or invalid city entry
      continue;
    }

    return { rule, cityRate };
  }
  return null;
}

/**
 * Validates quantity rules before persisting.
 * Throws Error with readable message if invalid.
 */
export function validateQuantityRules(rules) {
  if (!rules || typeof rules !== 'object') {
    throw new Error('Quantity shipping rules must be an object');
  }
  const minShipping = Number(rules.minimum_shipping);
  if (!Number.isFinite(minShipping) || minShipping < 0) {
    throw new Error('Minimum shipping amount must be a non-negative number');
  }
  if (!Array.isArray(rules.categories)) {
    throw new Error('Categories must be an array');
  }

  for (let i = 0; i < rules.categories.length; i++) {
    const cat = rules.categories[i];
    const catName = String(cat.category || '').trim();
    if (!catName) {
      throw new Error(`Category at index ${i + 1} is missing a name`);
    }
    const unit = String(cat.unit || '').trim();
    if (!unit) {
      throw new Error(`Category "${catName}" requires a unit`);
    }
    const cap = Number(cat.cap);
    if (!Number.isFinite(cap) || cap < 0) {
      throw new Error(`Category "${catName}" cap must be a non-negative number (use 0 for no cap)`);
    }
    const maxTrip = Number(cat.max_units_per_trip);
    if (!Number.isFinite(maxTrip) || maxTrip < 0) {
      throw new Error(`Category "${catName}" max units per trip must be a non-negative number`);
    }
    if (cat.cities && typeof cat.cities === 'object') {
      for (const [cityName, rates] of Object.entries(cat.cities)) {
        if (!String(cityName).trim()) continue;
        const base = Number(rates.base_charge);
        const extra = Number(rates.extra_unit_rate);
        if (!Number.isFinite(base) || base < 0) {
          throw new Error(`Category "${catName}" - city "${cityName}" base charge must be a non-negative number`);
        }
        if (!Number.isFinite(extra) || extra < 0) {
          throw new Error(`Category "${catName}" - city "${cityName}" extra unit rate must be a non-negative number`);
        }
      }
    }
  }
  return true;
}

/**
 * Core shipping calculation function.
 * Used by /api/shipping-quote, order creation, and Admin Calculator tab.
 */
export function calculateShipping({ items = [], groups = [], customerCity, settings = {} }) {
  try {
    const canonicalCustomerCity = String(customerCity || '').trim();
    const freeRule = settings?.freeRule;
    const distanceRule = settings?.distanceRule;
    const coreCities = Array.isArray(settings?.coreCities) ? settings.coreCities : [];
    const distances = Array.isArray(settings?.distances) ? settings.distances : [];

    const coreByCity = new Map(
      coreCities
        .filter((row) => row.is_active)
        .map((row) => [String(row.city_name || '').trim().toLowerCase(), Number(row.fixed_cost)])
    );

    const routes = new Map(
      distances
        .filter((row) => row.is_active)
        .map((row) => [
          `${String(row.from_city || '').trim().toLowerCase()}|${String(row.to_city || '').trim().toLowerCase()}`,
          Number(row.distance_km),
        ])
    );

    // If only legacy groups passed without items:
    if ((!items || items.length === 0) && groups && groups.length > 0) {
      return legacyCalculateShipping({ groups, customerCity: canonicalCustomerCity, settings });
    }

    if (!items || items.length === 0) {
      return { breakdown: [], totalShipping: 0 };
    }

    // Calculate total order value
    const totalOrderValue = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );

    // Check free shipping threshold
    const minOrderVal = Number(freeRule?.min_order_value);
    const isFreeActive = Boolean(freeRule?.is_active && Number.isFinite(minOrderVal) && minOrderVal > 0);

    const allSameCity = items.every((item) =>
      sameCity(item.source_city || item.vendorCity || canonicalCustomerCity, canonicalCustomerCity)
    );
    const qualifiesForFree =
      isFreeActive && totalOrderValue >= minOrderVal && (!freeRule.applicable_only_to_same_city || allSameCity);

    if (qualifiesForFree) {
      return {
        breakdown: [
          {
            category: 'All Categories',
            vendorCity: items[0]?.source_city || canonicalCustomerCity,
            customerCity: canonicalCustomerCity,
            orderValue: totalOrderValue,
            distanceKm: null,
            shippingCost: 0,
            label: `Free shipping applied (orders over ₹${minOrderVal.toLocaleString('en-IN')})`,
            free: true,
          },
        ],
        totalShipping: 0,
        free: true,
      };
    }

    // Process Quantity Rules
    let quantityRules = settings?.quantityRules;
    if (!quantityRules || !Array.isArray(quantityRules.categories)) {
      quantityRules = DEFAULT_QUANTITY_SHIPPING_RULES;
    }
    const minGlobalShipping = Math.max(0, Number(quantityRules?.minimum_shipping) || 0);
    const categoryRules = quantityRules.categories || [];

    const breakdown = [];
    let totalQuantityShipping = 0;
    let hasMatchedRules = false;

    // Group items: those that match a category rule vs fallback
    const matchedCategoryGroups = new Map();
    const fallbackItems = [];

    for (const item of items) {
      const match = findMatchingRule(item, categoryRules, canonicalCustomerCity);
      if (match) {
        hasMatchedRules = true;
        const catKey = String(match.rule.category).trim().toLowerCase();
        if (!matchedCategoryGroups.has(catKey)) {
          matchedCategoryGroups.set(catKey, {
            rule: match.rule,
            cityRate: match.cityRate,
            items: [],
            totalQty: 0,
            totalValue: 0,
          });
        }
        const grp = matchedCategoryGroups.get(catKey);
        const qty = Number(item.quantity) || 1;
        grp.items.push(item);
        grp.totalQty += qty;
        grp.totalValue += (Number(item.price) || 0) * qty;
      } else {
        fallbackItems.push(item);
      }
    }

    // Compute shipping for matched category groups
    for (const [, grp] of matchedCategoryGroups.entries()) {
      const { rule, cityRate, totalQty } = grp;
      const maxPerTrip = Number(rule.max_units_per_trip);
      const trips = maxPerTrip > 0 ? Math.ceil(totalQty / maxPerTrip) : 1;
      const base = Math.max(0, Number(cityRate.base_charge) || 0);
      const extra = Math.max(0, Number(cityRate.extra_unit_rate) || 0);

      // Formula: trips * base + (qty - trips) * extra
      let cost = trips * base + Math.max(0, totalQty - trips) * extra;
      const cap = Number(rule.cap);
      const isCapped = cap > 0 && cost > cap;
      if (isCapped) {
        cost = cap;
      }

      totalQuantityShipping += cost;

      const unitStr = rule.unit || grp.items[0]?.unit || 'units';
      const tripNote = trips > 1 ? ` (${trips} trips)` : '';
      const capNote = isCapped ? ` [Capped at ₹${cap.toLocaleString('en-IN')}]` : '';

      breakdown.push({
        category: rule.category,
        vendorCity: grp.items[0]?.source_city || canonicalCustomerCity,
        customerCity: canonicalCustomerCity,
        orderValue: grp.totalValue,
        quantity: totalQty,
        unit: unitStr,
        trips,
        maxPerTrip,
        baseCharge: base,
        extraRate: extra,
        cap: cap > 0 ? cap : null,
        shippingCost: cost,
        label: `Shipping (${rule.category}, ${totalQty} ${unitStr}): ₹${cost.toLocaleString('en-IN')}${tripNote}${capNote}`,
      });
    }

    // Compute fallback for unmatched items using existing city/distance logic
    let fallbackShipping = 0;
    let distanceError = false;

    if (fallbackItems.length > 0) {
      const fallbackGroups = new Map();
      for (const item of fallbackItems) {
        const sc = String(item.source_city || item.vendorCity || canonicalCustomerCity).trim();
        const scKey = sc.toLowerCase();
        if (!fallbackGroups.has(scKey)) {
          fallbackGroups.set(scKey, { vendorCity: sc, orderValue: 0, items: [] });
        }
        const fg = fallbackGroups.get(scKey);
        fg.items.push(item);
        fg.orderValue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
      }

      for (const [, fg] of fallbackGroups.entries()) {
        const sourceCity = fg.vendorCity;
        const coreCost = coreByCity.get(sourceCity.toLowerCase());

        if (sameCity(sourceCity, canonicalCustomerCity) && coreCost !== undefined) {
          fallbackShipping += coreCost;
          breakdown.push({
            vendorCity: sourceCity,
            customerCity: canonicalCustomerCity,
            orderValue: fg.orderValue,
            distanceKm: null,
            shippingCost: coreCost,
            label: `Shipping (${sourceCity}, same city): ₹${coreCost.toLocaleString('en-IN')}`,
          });
        } else {
          const key = `${sourceCity.toLowerCase()}|${canonicalCustomerCity.toLowerCase()}`;
          const reverseKey = `${canonicalCustomerCity.toLowerCase()}|${sourceCity.toLowerCase()}`;
          const distanceKm = routes.get(key) ?? routes.get(reverseKey);

          if (!sourceCity || distanceKm === undefined || !distanceRule?.is_active) {
            distanceError = true;
            breakdown.push({
              vendorCity: sourceCity || 'Source city unavailable',
              customerCity: canonicalCustomerCity,
              orderValue: fg.orderValue,
              distanceKm: null,
              shippingCost: null,
              label: `Shipping (${sourceCity || 'source city'} → ${canonicalCustomerCity}): distance needs configuration`,
            });
          } else {
            const cost = Number(distanceKm) * Number(distanceRule.rate_per_km);
            fallbackShipping += cost;
            breakdown.push({
              vendorCity: sourceCity,
              customerCity: canonicalCustomerCity,
              orderValue: fg.orderValue,
              distanceKm,
              shippingCost: cost,
              label: `Shipping (${sourceCity} → ${canonicalCustomerCity}, ${distanceKm}km): ₹${cost.toLocaleString('en-IN')}`,
            });
          }
        }
      }
    }

    if (distanceError) {
      return { breakdown, totalShipping: null };
    }

    let categoryShipping = totalQuantityShipping;
    if (hasMatchedRules && minGlobalShipping > 0 && categoryShipping < minGlobalShipping) {
      const diff = minGlobalShipping - categoryShipping;
      categoryShipping = minGlobalShipping;
      breakdown.push({
        category: 'Minimum Adjustment',
        shippingCost: diff,
        label: `Minimum Order Shipping Adjustment: +₹${diff.toLocaleString('en-IN')} (min ₹${minGlobalShipping.toLocaleString('en-IN')})`,
      });
    }

    const finalTotal = categoryShipping + fallbackShipping;
    return { breakdown, totalShipping: finalTotal };
  } catch (error) {
    console.error('Error in calculateShipping, falling back to legacy calculation:', error);
    return legacyCalculateShipping({ groups, customerCity, settings });
  }
}

/**
 * Legacy calculation using groups of items by vendorCity.
 */
function legacyCalculateShipping({ groups = [], customerCity, settings = {} }) {
  const canonicalCustomerCity = String(customerCity || '').trim();
  const coreCities = Array.isArray(settings?.coreCities) ? settings.coreCities : [];
  const distances = Array.isArray(settings?.distances) ? settings.distances : [];
  const distanceRule = settings?.distanceRule;
  const freeRule = settings?.freeRule;

  const coreByCity = new Map(
    coreCities
      .filter((row) => row.is_active)
      .map((row) => [String(row.city_name || '').trim().toLowerCase(), Number(row.fixed_cost)])
  );
  const routes = new Map(
    distances
      .filter((row) => row.is_active)
      .map((row) => [
        `${String(row.from_city || '').trim().toLowerCase()}|${String(row.to_city || '').trim().toLowerCase()}`,
        Number(row.distance_km),
      ])
  );

  const breakdown = groups.map((group) => {
    const sourceCity = String(group.vendorCity || '').trim();
    const orderValue = Number(group.orderValue) || 0;
    const coreCost = coreByCity.get(sourceCity.toLowerCase());

    if (sameCity(sourceCity, canonicalCustomerCity) && coreCost !== undefined) {
      const free =
        freeRule?.is_active &&
        (!freeRule.applicable_only_to_same_city || sameCity(sourceCity, canonicalCustomerCity)) &&
        orderValue >= Number(freeRule.min_order_value);
      return {
        vendorCity: sourceCity,
        customerCity: canonicalCustomerCity,
        orderValue,
        distanceKm: null,
        shippingCost: free ? 0 : coreCost,
        label: free
          ? `Shipping (${sourceCity}, same city): Free (order above ₹${Number(freeRule.min_order_value).toLocaleString('en-IN')})`
          : `Shipping (${sourceCity}, same city): ₹${coreCost.toLocaleString('en-IN')}`,
      };
    }

    const key = `${sourceCity.toLowerCase()}|${canonicalCustomerCity.toLowerCase()}`;
    const reverseKey = `${canonicalCustomerCity.toLowerCase()}|${sourceCity.toLowerCase()}`;
    const distanceKm = routes.get(key) ?? routes.get(reverseKey);

    if (!sourceCity || distanceKm === undefined || !distanceRule?.is_active) {
      return {
        vendorCity: sourceCity || 'Source city unavailable',
        customerCity: canonicalCustomerCity,
        orderValue,
        distanceKm: null,
        shippingCost: null,
        label: `Shipping (${sourceCity || 'source city'} → ${canonicalCustomerCity}): distance needs configuration`,
      };
    }

    const free =
      freeRule?.is_active &&
      !freeRule.applicable_only_to_same_city &&
      orderValue >= Number(freeRule.min_order_value);
    const shippingCost = free ? 0 : Number(distanceKm) * Number(distanceRule.rate_per_km);

    return {
      vendorCity: sourceCity,
      customerCity: canonicalCustomerCity,
      orderValue,
      distanceKm,
      shippingCost,
      label: free
        ? `Shipping (${sourceCity} → ${canonicalCustomerCity}, ${distanceKm}km): Free (order above ₹${Number(freeRule.min_order_value).toLocaleString('en-IN')})`
        : `Shipping (${sourceCity} → ${canonicalCustomerCity}, ${distanceKm}km): ₹${shippingCost.toLocaleString('en-IN')}`,
    };
  });

  return {
    breakdown,
    totalShipping: breakdown.every((row) => row.shippingCost !== null)
      ? breakdown.reduce((sum, row) => sum + row.shippingCost, 0)
      : null,
  };
}
