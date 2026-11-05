/**
 * Dynamic Attribute Configuration & Helpers for HomeRun-style product filtering and management.
 * Covers: Category, Brand, Type, Size, Colors, Material, Grade, Price, Pack Size, Thickness.
 */

// ── Granular Configurations for Each Subcategory & Category ──
export const CATEGORY_ATTRIBUTE_MAP = {
  // ── BUILDING MATERIALS SUBCATEGORIES ──
  cement: {
    label: 'Cement Specifications',
    fields: ['grade', 'type', 'pack_size', 'color'],
    grade: ['OPC 53 Grade', 'OPC 43 Grade', 'PPC (Portland Pozzolana)', 'PSC (Portland Slag)', 'White Portland', 'Waterproof Cement'],
    type: ['PPC Cement', 'OPC 53 Grade', 'OPC 43 Grade', 'White Cement', 'Waterproof Cement', 'Rapid Hardening Cement'],
    pack_size: ['50 Kg Bag', '25 Kg Bag', '1 Ton (20 Bags)', '10 Kg Bag', '5 Kg Pack', '1 Kg Pack'],
    color: ['Grey', 'Super White', 'Off-White'],
  },

  steel: {
    label: 'Steel & TMT Rebars',
    fields: ['thickness', 'grade', 'size', 'type', 'material', 'pack_size'],
    thickness: ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm', '28mm', '32mm'],
    grade: ['Fe 500D', 'Fe 550D', 'Fe 500', 'Fe 550', 'Fe 600', 'Primary Steel', 'Secondary Steel'],
    size: ['12m Standard Length', 'Full Length (40 ft)', 'Custom Cut Length'],
    type: ['TMT Rebar', 'Primary TMT Bar', 'Binding Wire', 'MS Angle', 'MS Flat Bar', 'Square Bar', 'Round Pipe'],
    material: ['Primary Virgin Steel', 'Thermo-Mechanically Treated (TMT)', 'Mild Steel (MS)', 'Galvanized Iron (GI)'],
    pack_size: ['1 Bundle', '1 Ton', '1 Quintal (100 Kg)', 'Per Piece'],
  },

  brick: {
    label: 'Brick Specifications',
    fields: ['type', 'size', 'grade', 'material', 'pack_size'],
    type: ['Red Clay Brick (Laal Eent)', 'Fly Ash Brick', 'Fire Clay Brick', 'Perforated Brick', 'Engineering Brick'],
    size: ['9x4x3 inch (Standard Brick)', '9x4.5x3 inch', '190x90x90 mm (Modular)'],
    grade: ['Class 1 (10.5 N/mm²)', 'Class 2 (7.5 N/mm²)', 'Class 3 (3.5 N/mm²)'],
    material: ['Kiln-Burnt Red Clay', 'Fly Ash & Cement', 'Refractory Clay'],
    pack_size: ['Per 1000 Pcs', 'Trolley (2500 Pcs)', 'Truckload (5000 Pcs)', 'Single Piece'],
  },

  block: {
    label: 'Block Specifications (AAC & Concrete)',
    fields: ['type', 'size', 'grade', 'material', 'pack_size'],
    type: ['AAC Block (Autoclaved Aerated Concrete)', 'Concrete Solid Block', 'Concrete Hollow Block', 'Cellular Lightweight Concrete (CLC)'],
    size: ['600x200x100 mm (4 inch)', '600x200x150 mm (6 inch)', '600x200x200 mm (8 inch)', '600x200x225 mm (9 inch)', '400x200x200 mm'],
    grade: ['Grade 1 (4 N/mm²)', 'Grade 2 (3 N/mm²)', 'Heavy Load Bearing'],
    material: ['Autoclaved Aerated Concrete', 'Solid Precast Concrete', 'Fly Ash CLC'],
    pack_size: ['Per Cubic Meter (m³)', 'Per Piece', 'Pallet (50 Pcs)', 'Truckload'],
  },

  sand: {
    label: 'Sand & Morrum Specifications',
    fields: ['type', 'grade', 'pack_size', 'color'],
    type: ['M-Sand (Manufactured Sand)', 'P-Sand (Plaster Sand)', 'River Sand (Nadi ki Ret)', 'Coarse Sand (Zone II)', 'Fine Sand (Zone IV)', 'Pit Sand (Khadan Ret)'],
    grade: ['Zone II (Coarse - Concrete)', 'Zone III (Medium - Masonry)', 'Zone IV (Fine - Plaster)'],
    pack_size: ['CFT (Cubic Feet)', 'Metric Ton', 'Dumper (1000 CFT)', 'Trolley (150 CFT)', '50 Kg Bag'],
    color: ['Natural River Grey', 'Black / Dark Grey (M-Sand)', 'Golden Pit Sand'],
  },

  aggregate: {
    label: 'Aggregate (Barjri / Gitti) Specifications',
    fields: ['thickness', 'type', 'pack_size'],
    thickness: ['10mm (Gitti)', '20mm (Standard Gitti)', '40mm (Foundation / Base)', 'Stone Dust', 'Blue Metal 20mm', 'Blue Metal 10mm'],
    type: ['Coarse Aggregate', 'Fine Aggregate', 'Crushed Granite Stone', 'Pea Gravel'],
    pack_size: ['CFT (Cubic Feet)', 'Metric Ton', 'Dumper (800-1000 CFT)', 'Trolley (120-150 CFT)', '50 Kg Bag'],
  },

  tiles: {
    label: 'Tiles & Flooring Specifications',
    fields: ['size', 'thickness', 'type', 'material', 'color', 'grade', 'pack_size'],
    size: ['600x600 mm (2x2 ft)', '600x1200 mm (2x4 ft)', '800x1600 mm', '800x800 mm', '300x450 mm (1x1.5 ft)', '300x600 mm', '300x300 mm (1x1 ft)'],
    thickness: ['8mm', '9mm', '10mm', '12mm', '15mm', '18mm'],
    type: ['Glazed Vitrified (GVT)', 'Polished Glazed (PGVT)', 'Double Charge Vitrified', 'Full Body Vitrified', 'Ceramic Wall Tiles', 'Anti-Skid Floor Tiles', 'Porcelain Tiles'],
    material: ['Vitrified Porcelain', 'Glazed Ceramic', 'Full Body Clay', 'Quartz Composite'],
    color: ['White / Statuario Marble', 'Beige / Crema', 'Light Grey', 'Dark Grey', 'Black Marble Texture', 'Wood Grain Texture', 'Off-White'],
    grade: ['Premium Grade (Grade 1)', 'Standard Grade', 'Anti-Skid R10'],
    pack_size: ['Box (4 Tiles / 15.5 Sq.ft)', 'Box (2 Tiles / 15.5 Sq.ft)', 'Box (8 Tiles / 12 Sq.ft)'],
  },

  marble: {
    label: 'Marble & Granite Specifications',
    fields: ['thickness', 'size', 'type', 'material', 'color'],
    thickness: ['16mm', '18mm', '20mm', '25mm', '30mm'],
    size: ['Slab (Full Sheet)', 'Custom Cut Tile', 'Countertop 8x2 ft', 'Steps & Riser'],
    type: ['Italian Marble', 'Indian White Marble', 'Granite Slab', 'Travertine', 'Onyx'],
    material: ['Natural Marble', 'Natural Granite', 'Engineered Quartz', 'Sandstone'],
    color: ['Makrana Pure White', 'Black Galaxy Granite', 'Z Black Granite', 'Statuario White', 'Botticino Beige', 'Alaska White'],
  },

  glass: {
    label: 'Architectural Glass Specifications',
    fields: ['thickness', 'type', 'color', 'size'],
    thickness: ['4mm', '5mm', '6mm', '8mm', '10mm', '12mm', '15mm', '19mm'],
    type: ['Toughened Glass', 'Clear Float Glass', 'Frosted / Acid Etched', 'Tinted Glass', 'Laminated Safety Glass', 'Reflective Glass'],
    color: ['Clear', 'Extra Clear (Low Iron)', 'Frosted White', 'Bronze', 'Dark Grey', 'Green Tint', 'Blue Tint'],
    size: ['Custom Cut Size', 'Full Sheet 8x6 ft', 'Door Panel Size'],
  },

  pop: {
    label: 'POP & Gypsum Plaster Specifications',
    fields: ['type', 'pack_size', 'grade', 'color'],
    type: ['One Coat Gypsum Plaster', 'Premium White POP', 'Bonding Agent', 'Jointing Compound'],
    pack_size: ['25 Kg Bag', '20 Kg Bag', '40 Kg Bag', '50 Kg Bag'],
    grade: ['Super White Plaster Grade', 'Slow Setting (15-20 min)', 'Crack Resistant'],
    color: ['Super White', 'Off-White'],
  },

  waterproofing: {
    label: 'Waterproofing & Chemicals Specifications',
    fields: ['type', 'pack_size', 'grade', 'color'],
    type: ['Liquid Waterproofing Membrane', 'Damp Proof Superflex', 'Integral Liquid Waterproofing (LW+)', 'SBR Latex Bonding Agent', 'Crystalline Slurry Coating'],
    pack_size: ['1 Litre', '5 Litres', '10 Litres', '20 Litres', '50 Litres', '1 Kg', '5 Kg', '20 Kg'],
    grade: ['10 Year Waterproof Warranty', '5 Year Waterproof Warranty', 'Heavy Duty UV Resistant'],
    color: ['Terracotta', 'White', 'Grey', 'Transparent / Clear'],
  },

  // ── CARPENTRY & WOODWORK ──
  plywood: {
    label: 'Plywood & Boards Specifications',
    fields: ['thickness', 'size', 'grade', 'type', 'material'],
    thickness: ['4mm', '6mm', '8mm', '9mm', '12mm', '16mm', '18mm', '19mm', '25mm'],
    size: ["8' X 4'", "7' X 4'", "8' X 3'", "7' X 3'", "6' X 4'", "6' X 3'"],
    grade: ['MR Grade (IS:303)', 'BWP Marine (IS:710)', 'BWR Grade', 'Commercial Grade', 'Club Prime'],
    type: ['Calibrated Plywood', 'Non-Calibrated', 'Pre-Laminated', 'Fire Retardant'],
    material: ['BWP Marine Hardwood', 'Gurjan Core', 'Eucalyptus Core', 'HDHMR Board', 'MDF Board'],
  },

  timber: {
    label: 'Timber & Lumber Specifications',
    fields: ['type', 'size', 'grade', 'material'],
    type: ['Teak Wood (Sagwan)', 'Sal Wood', 'Pine Wood (Kail / Deodar)', 'Marandi Wood', 'Sheesham'],
    size: ['Custom Cut Size', 'Running Foot (RFT)', 'CFT (Cubic Feet)', 'Plank / Batten'],
    grade: ['Seasoned A-Grade', 'Kiln Dried', 'Rough Sawn'],
    material: ['Natural Hardwood', 'Natural Softwood', 'Imported Timber'],
  },

  // ── PLUMBING ──
  pipes: {
    label: 'Pipes & Fittings Specifications',
    fields: ['size', 'thickness', 'type', 'grade', 'material'],
    size: ['1/2 inch (15mm)', '3/4 inch (20mm)', '1 inch (25mm)', '1.25 inch (32mm)', '1.5 inch (40mm)', '2 inch (50mm)', '3 inch (75mm)', '4 inch (110mm)'],
    thickness: ['SDR 11 (Heavy)', 'SDR 13.5 (Standard)', 'SCH 40', 'SCH 80', 'Class 1'],
    type: ['CPVC Plumbing Pipe', 'UPVC Cold Water Pipe', 'SWR Drainage Pipe', 'PVC Conduit'],
    grade: ['SDR 11 Heavy Duty', 'SDR 13.5 Standard', 'Schedule 40', 'Schedule 80'],
    material: ['CPVC (Chlorinated PVC)', 'UPVC (Unplasticized PVC)', 'PVC'],
  },

  sanitary: {
    label: 'Sanitary & Bath Fittings',
    fields: ['type', 'material', 'color', 'size'],
    type: ['Wall Hung Commode', 'One Piece Toilet', 'Overhead Shower', 'Wall Mixer', 'Health Faucet', 'Basin Tap', 'Kitchen Sink'],
    material: ['Ceramic Vitreous China', 'Solid Brass', 'Stainless Steel 304'],
    color: ['Chrome Silver', 'Matte Black', 'White', 'Rose Gold', 'Brushed Nickel'],
    size: ['Standard', 'Single Bowl', 'Double Bowl with Drain', '150mm Shower'],
  },

  // ── ELECTRICAL ──
  wires: {
    label: 'Electrical Wires & Cables',
    fields: ['size', 'type', 'grade', 'pack_size', 'color'],
    size: ['0.75 sq mm', '1.0 sq mm', '1.5 sq mm', '2.5 sq mm', '4.0 sq mm', '6.0 sq mm', '10 sq mm'],
    type: ['Single Core Flexible Wire', 'Multi-Strand Copper Wire', 'Submersible Cable', 'Armoured Cable'],
    grade: ['FR (Flame Retardant)', 'FR-LSH (Low Smoke Halogen)', 'ZHFR (Zero Halogen)', 'ISI Marked'],
    pack_size: ['90m Box / Coil', '180m Coil', '100m Drum'],
    color: ['Red (Phase)', 'Black (Neutral)', 'Green (Earth)', 'Blue', 'Yellow'],
  },

  switches: {
    label: 'Switches, Sockets & MCBs',
    fields: ['size', 'type', 'color', 'grade'],
    size: ['1 Module', '2 Module', '3 Module', '4 Module', '6 Module', '8 Module', '6A', '16A', '20A', '25A', '32A'],
    type: ['Modular Switch', 'Power Socket', 'MCB (Miniature Circuit Breaker)', 'Distribution Board (DB)', 'Fan Regulator'],
    color: ['White', 'Matte Black', 'Dark Grey', 'Silver Grey'],
    grade: ['C-Curve MCB (10kA)', 'B-Curve MCB', 'Heavy Duty Polycarbonate'],
  },

  // ── HARDWARE ──
  hardware: {
    label: 'Hardware & Fittings Specifications',
    fields: ['size', 'thickness', 'type', 'grade', 'material', 'color'],
    thickness: ['1.5mm', '2.0mm', '2.5mm', '3.0mm'],
    size: ['3 inch', '4 inch', '5 inch', '8 inch', '10 inch', '12 inch', '14 inch', '16 inch', '18 inch', '20 inch', '24 inch'],
    type: ['Concealed Soft Close Hinge', 'Telescopic Drawer Slide', 'Slim Box Drawer System', 'Mortise Door Lock & Handle', 'Cabinet Handle'],
    grade: ['Grade 304 (Corrosion Proof)', 'Grade 201 Standard', 'Soft Close Hydraulic', 'Heavy Duty 45kg Load'],
    material: ['Stainless Steel 304', 'Stainless Steel 201', 'Zinc Alloy (Zamak)', 'Brass'],
    color: ['SS Matte Finish', 'Glossy Chrome', 'Matte Black', 'Rose Gold', 'Antique Brass'],
  },

  // ── PAINTS ──
  paints: {
    label: 'Paints & Coatings Specifications',
    fields: ['pack_size', 'type', 'grade', 'color'],
    pack_size: ['1 Litre', '4 Litres', '10 Litres', '20 Litres', '1 Kg', '5 Kg', '20 Kg', '40 Kg'],
    type: ['Interior Luxury Emulsion', 'Exterior Weatherproof Emulsion', 'Acrylic Distemper', 'PU Enamel Paint', 'Wall Putty', 'Plastering Primer'],
    grade: ['10 Year Warranty Sheen', '5 Year Warranty', 'High Washability', 'Anti-Fungal'],
    color: ['White', 'Off-White', 'Ivory', 'Light Grey', 'Warm Beige', 'Sky Blue'],
  },

  // ── FALLBACK GENERAL ──
  general: {
    label: 'General Material Specifications',
    fields: ['type', 'grade', 'pack_size', 'size', 'thickness', 'material', 'color'],
    thickness: ['4mm', '6mm', '8mm', '10mm', '12mm', '16mm', '18mm', '25mm'],
    size: ['Standard', '600x600 mm', '600x1200 mm', "8' X 4'", '1 Litre', '50 kg'],
    pack_size: ['50 Kg Bag', '25 Kg Bag', '1 Litre', '4 Litre', '20 Litre', '1 Piece'],
    type: ['Standard', 'Premium', 'Commercial', 'Waterproof'],
    grade: ['Standard Grade', 'Premium Grade', 'Commercial Grade'],
    material: ['Steel', 'Wood', 'Ceramic', 'PVC', 'Brass', 'Cement'],
    color: ['White', 'Black', 'Grey', 'Brown', 'Silver'],
  },
};

/**
 * Resolves the precise attribute config for a given category and subcategory.
 * Matches subcategory first for maximum accuracy.
 */
export function getCategoryAttributeConfig(category = '', subcategory = '') {
  const sub = String(subcategory || '').toLowerCase().trim();
  const cat = String(category || '').toLowerCase().trim();

  // 1. Precise Subcategory Matching
  if (/cement/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.cement;
  if (/steel|iron|tmt|rebar|sariya/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.steel;
  if (/brick/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.brick;
  if (/block/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.block;
  if (/sand/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.sand;
  if (/aggregate|barjri|bajri|gitti/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.aggregate;
  if (/pop|plaster of paris|gypsum/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.pop;
  if (/tile/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.tiles;
  if (/marble|granite/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.marble;
  if (/glass/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.glass;
  if (/waterproof/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.waterproofing;

  // Carpentry subcategories
  if (/plywood|ply|board|hdhmr|mdf|laminate|hpl/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.plywood;
  if (/timber|wood|lakdi/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.timber;

  // Plumbing subcategories
  if (/pipe|cpvc|upvc|pvc/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.pipes;
  if (/sanitary|bath|fitting|tank|shower|faucet/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.sanitary;

  // Electrical subcategories
  if (/wire|cable/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.wires;
  if (/switch|socket|mcb|db|light|led/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.switches;

  // Hardware subcategories
  if (/hinge|channel|handle|lock|fitting|wardrobe|kitchen system/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.hardware;

  // Paints / Chemicals
  if (/paint|distemper|primer|putty|enamel/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.paints;
  if (/chemical|adhesive/.test(sub)) return CATEGORY_ATTRIBUTE_MAP.waterproofing;

  // 2. Category Level Fallback (when subcategory is not chosen yet)
  if (/building/.test(cat)) {
    // Return prompt-ready config indicating user should pick a subcategory
    return {
      label: 'Building Materials (Select a subcategory above for exact specs)',
      isBuildingMaterialsPrompt: true,
      fields: ['type', 'grade', 'pack_size', 'size', 'thickness', 'material', 'color'],
      ...CATEGORY_ATTRIBUTE_MAP.general,
    };
  }

  if (/carpentry/.test(cat)) return CATEGORY_ATTRIBUTE_MAP.plywood;
  if (/plumb/.test(cat)) return CATEGORY_ATTRIBUTE_MAP.pipes;
  if (/electr/.test(cat)) return CATEGORY_ATTRIBUTE_MAP.switches;
  if (/hardware|furniture/.test(cat)) return CATEGORY_ATTRIBUTE_MAP.hardware;
  if (/paint/.test(cat)) return CATEGORY_ATTRIBUTE_MAP.paints;
  if (/chemical/.test(cat)) return CATEGORY_ATTRIBUTE_MAP.waterproofing;

  return CATEGORY_ATTRIBUTE_MAP.general;
}

/**
 * Normalizes text for lenient comparisons (e.g. "18 mm" === "18mm", "8 x 4" === "8x4")
 */
export function normalizeAttributeValue(val) {
  if (val == null) return '';
  return String(val)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

/**
 * Extracts standard attributes from a product object (reads specifications object or falls back to text scanning).
 */
export function extractProductAttributes(product) {
  if (!product || typeof product !== 'object') {
    return { thickness: '', size: '', type: '', color: '', material: '', grade: '', pack_size: '' };
  }

  const specs = (product.specifications && typeof product.specifications === 'object')
    ? product.specifications
    : {};

  const findSpec = (...keys) => {
    for (const k of keys) {
      if (specs[k]) return String(specs[k]).trim();
      const lowerKey = k.toLowerCase().replace(/[\s_-]/g, '');
      for (const [sKey, sVal] of Object.entries(specs)) {
        if (sKey.toLowerCase().replace(/[\s_-]/g, '') === lowerKey && sVal) {
          return String(sVal).trim();
        }
      }
    }
    return '';
  };

  let thickness = findSpec('thickness', 'Thickness', 'mm', 'gauge');
  let size = findSpec('size', 'Size', 'dimension', 'dimensions', 'Dimension', 'Dimensions');
  let type = findSpec('type', 'Type', 'finish', 'Finish');
  let color = findSpec('color', 'Color', 'colors', 'Colors', 'shade', 'Shade');
  let material = findSpec('material', 'Material', 'composition');
  let grade = findSpec('grade', 'Grade', 'is_standard', 'IS', 'quality_grade');
  let pack_size = findSpec('pack_size', 'packSize', 'PackSize', 'Pack Size', 'pack', 'Pack', 'packing', 'Packing', 'weight');

  const textToScan = `${product.name || ''} ${product.description || ''} ${product.subcategory || ''}`;

  if (!thickness) {
    const match = textToScan.match(/(?:^|\s|\()(\d+(?:\.\d+)?\s*(?:mm|gauge|sdr\s*\d+))\b/i);
    if (match) thickness = match[1].replace(/\s+/g, '');
  }

  if (!size) {
    const match = textToScan.match(/(?:^|\s|\()(\d+\s*['xX]\s*\d+\s*(?:ft|feet|mm|cm|inch|in|')?)\b/i);
    if (match) size = match[1].replace(/\s+/g, '');
  }

  return { thickness, size, type, color, material, grade, pack_size };
}

/**
 * Checks if a product matches a target attribute filter value.
 */
export function matchesAttribute(product, attributeKey, targetValue) {
  if (!targetValue || targetValue === 'all') return true;
  const productAttrs = extractProductAttributes(product);
  const prodVal = productAttrs[attributeKey];
  if (!prodVal) return false;

  const normTarget = normalizeAttributeValue(targetValue);
  const normProd = normalizeAttributeValue(prodVal);

  if (normProd === normTarget) return true;
  if (normProd.includes(normTarget) || normTarget.includes(normProd)) return true;

  return false;
}

/**
 * Collects all unique available attributes from a list of products.
 */
export function collectUniqueAttributes(products = []) {
  const thicknesses = new Set();
  const sizes = new Set();
  const types = new Set();
  const colors = new Set();
  const materials = new Set();
  const grades = new Set();
  const packSizes = new Set();

  for (const p of products) {
    const attrs = extractProductAttributes(p);
    if (attrs.thickness) thicknesses.add(attrs.thickness);
    if (attrs.size) sizes.add(attrs.size);
    if (attrs.type) types.add(attrs.type);
    if (attrs.color) colors.add(attrs.color);
    if (attrs.material) materials.add(attrs.material);
    if (attrs.grade) grades.add(attrs.grade);
    if (attrs.pack_size) packSizes.add(attrs.pack_size);
  }

  return {
    thicknesses: Array.from(thicknesses).sort(),
    sizes: Array.from(sizes).sort(),
    types: Array.from(types).sort(),
    colors: Array.from(colors).sort(),
    materials: Array.from(materials).sort(),
    grades: Array.from(grades).sort(),
    packSizes: Array.from(packSizes).sort(),
  };
}
