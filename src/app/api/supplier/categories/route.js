

import { NextResponse } from 'next/server';

// In-memory storage (replace with database later)
let categoriesDb = [
  {
    id: 1,
    name: "CEMENT & CONCRETE",
    emoji: "🧱",
    label: "HIGH VOLUME",
    labelColor: "blue",
    priceRange: "₹380–450 / bag",
    unit: "per 50kg bag",
    supplierId: 1, // Link to supplier
  },
  {
    id: 2,
    name: "STEEL & IRON",
    emoji: "⚙️",
    label: "ALWAYS NEEDED",
    labelColor: "yellow",
    priceRange: "₹55–65 / kg",
    unit: "per kilogram",
    supplierId: 1,
  },
  {
    id: 3,
    name: "WOOD & TIMBER",
    emoji: "🪵",
    label: "GROWING",
    labelColor: "green",
    priceRange: "₹400–800 / sheet",
    unit: "per sheet",
    supplierId: 1,
  },
  {
    id: 4,
    name: "HARDWARE & FIXTURES",
    emoji: "🔧",
    label: "STEADY DEMAND",
    labelColor: "purple",
    priceRange: "₹50–500 / unit",
    unit: "per unit",
    supplierId: 1,
  },
  {
    id: 5,
    name: "GLASS & ALUMINIUM",
    emoji: "🪟",
    label: "SPECIALIZED",
    labelColor: "pink",
    priceRange: "₹150–400 / SFT",
    unit: "per sq. ft.",
    supplierId: 1,
  },
  {
    id: 6,
    name: "PAINTS & CHEMICALS",
    emoji: "🎨",
    label: "REGULAR SUPPLY",
    labelColor: "orange",
    priceRange: "₹800–1500 / ltr",
    unit: "per litre",
    supplierId: 1,
  },
  {
    id: 7,
    name: "AGGREGATES & SAND",
    emoji: "🪨",
    label: "BULK SUPPLY",
    labelColor: "amber",
    priceRange: "₹35–80 / CFT",
    unit: "per cu. ft.",
    supplierId: 1,
  },
  {
    id: 8,
    name: "ELECTRICAL MATERIALS",
    emoji: "💡",
    label: "HIGH DEMAND",
    labelColor: "cyan",
    priceRange: "₹10–250 / unit",
    unit: "per unit",
    supplierId: 1,
  },
];

// GET /api/supplier/categories — fetch all or by supplier
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get('supplierId');

  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let data = categoriesDb;
    if (supplierId) {
      data = categoriesDb.filter(cat => cat.supplierId === parseInt(supplierId));
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/supplier/categories — create new category
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, emoji, label, labelColor, priceRange, unit, supplierId } = body;

    if (!name || !emoji || !label || !labelColor || !priceRange || !unit || !supplierId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newCategory = {
      id: Math.max(...categoriesDb.map(c => c.id), 0) + 1,
      name,
      emoji,
      label,
      labelColor,
      priceRange,
      unit,
      supplierId,
    };

    categoriesDb.push(newCategory);
    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/supplier/categories/[id] — update category
export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop());
    const body = await request.json();

    const index = categoriesDb.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    categoriesDb[index] = { ...categoriesDb[index], ...body, id };
    return NextResponse.json({ success: true, data: categoriesDb[index] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/supplier/categories/[id] — delete category
export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop());

    const index = categoriesDb.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const deleted = categoriesDb.splice(index, 1);
    return NextResponse.json({ success: true, data: deleted[0] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}