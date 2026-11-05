/**
 * Dynamic Attribute Configuration & Helpers for HomeRun-style product filtering and management.
 * Covers: Category, Brand, Type, Size, Colors, Material, Grade, Price, Pack Size, Thickness.
 */

export const CATEGORY_ATTRIBUTE_MAP = {
  // Carpentry, Plywood, Boards, Laminates
  carpentry: {
    label: 'Carpentry & Boards',
    fields: ['thickness', 'size', 'type', 'material', 'grade', 'color', 'pack_size'],
    thickness: ['4mm', '6mm', '8mm', '9mm', '12mm', '16mm', '18mm', '19mm', '25mm', '0.8mm', '1.0mm'],
    size: ["8' X 4'", "7' X 4'", "8' X 3'", "7' X 3'", "6' X 4'", "6' X 3'"],
    type: ['Calibrated Plywood', 'Non-Calibrated', 'Pre-Laminated', 'Raw Board', 'Marine Grade', 'Fire Retardant', 'Commercial Grade'],
    material: ['BWP Marine Plywood', 'BWR Plywood', 'HDHMR Board', 'MDF Board', 'Particle Board', 'Blockboard', 'Teak Wood', 'Pine Wood', 'HPL Laminate', 'Boilo Board'],
    grade: ['MR Grade (IS:303)', 'BWP Marine (IS:710)', 'BWR Grade', 'Commercial Grade', 'Club Prime', 'Sainik MR', 'Gold Grade'],
    pack_size: ['1 Sheet', 'Bundle of 5', 'Bundle of 10'],
    color: ['Natural Wood', 'Oak', 'Walnut', 'Teak', 'Glossy White', 'Matte White', 'Charcoal', 'Grey', 'Brown'],
  },

  // Building Materials & Masonry (Cement, Sand, Brick, Aggregates)
  'building-materials': {
    label: 'Building Materials & Cement',
    fields: ['type', 'grade', 'pack_size', 'size', 'thickness', 'material', 'color'],
    thickness: ['8mm', '9mm', '10mm', '12mm', '16mm', '20mm', '25mm', '32mm'],
    size: ['600x600 mm', '600x1200 mm', '800x1600 mm', '300x450 mm', '300x600 mm', '12m Length', 'Standard Brick'],
    pack_size: ['50 Kg Bag', '25 Kg Bag', '40 Kg Bag', '10 Kg Bag', '1 Ton', '1 Quintal'],
    type: ['PPC Cement', 'OPC 53 Grade', 'OPC 43 Grade', 'Waterproof Cement', 'White Cement', 'Fe 500D TMT', 'Fe 550D TMT', 'AAC Block', 'Red Clay Brick', 'M-Sand', 'P-Sand'],
    grade: ['PPC (Portland Pozzolana)', 'OPC 53 Grade', 'OPC 43 Grade', 'PSC (Slag)', 'White Portland', 'Fe 500D', 'Fe 550D', 'Plastering Grade (P-Sand)', 'Concrete Grade'],
    material: ['Ordinary Portland Cement', 'Portland Pozzolana', 'TMT Primary Steel', 'AAC Concrete', 'Clay', 'Quartz', 'Granite'],
    color: ['White', 'Off-White', 'Grey', 'Black', 'Steel Grey', 'Red'],
  },

  // Tiles, Adhesives & Flooring
  tiles: {
    label: 'Tiles, Flooring & Adhesives',
    fields: ['size', 'type', 'grade', 'pack_size', 'thickness', 'color', 'material'],
    thickness: ['8mm', '9mm', '10mm', '12mm', '15mm', '20mm'],
    size: ['600x600 mm (2x2 ft)', '600x1200 mm (2x4 ft)', '800x1600 mm', '800x800 mm', '300x450 mm (1x1.5 ft)', '300x600 mm', '300x300 mm (1x1 ft)'],
    pack_size: ['20 Kg Bag', '30 Kg Bag', '50 Kg Bag', '10 Kg', '5 Kg', '1 Kg Box'],
    type: ['Double Charged Vitrified', 'Glazed Vitrified (GVT)', 'Polished Glazed (PGVT)', 'Full Body Vitrified', 'Ceramic Wall Tiles', 'Anti-Skid Floor Tiles', 'Tile Adhesive (Type 1)', 'Tile Adhesive (Type 2)', 'Epoxy Grout'],
    grade: ['Standard Adhesive (T01 / 303)', 'Polymer Modified (T02 / 305)', 'High Strength Vitrified (T09 / 315)', 'Epoxy Grout (RG)', 'Waterproof Grade'],
    color: ['White', 'Off-White', 'Grey', 'Beige', 'Crema', 'Black', 'Brown', 'Blue', 'Green', 'Marble Finish'],
    material: ['Vitrified Porcelain', 'Glazed Ceramic', 'Full Body Vitrified', 'Natural Marble', 'Granite'],
  },

  // Steel & Iron
  steel: {
    label: 'Steel & TMT Bars',
    fields: ['thickness', 'type', 'grade', 'size', 'material'],
    thickness: ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm', '28mm', '32mm'],
    size: ['12m standard length', 'Custom Cut'],
    pack_size: ['Bundle', '1 Ton', 'Piece'],
    type: ['Fe 500D', 'Fe 550D', 'Fe 500', 'Fe 600', 'TMT Bars', 'Binding Wire', 'Mild Steel Channel', 'Square Pipe'],
    grade: ['Fe 500D', 'Fe 550D', 'Fe 500', 'Primary Virgin Steel', 'Secondary Steel'],
    material: ['Primary Virgin Steel', 'Thermo-Mechanically Treated (TMT)', 'Mild Steel (MS)', 'Galvanized Iron (GI)'],
    color: ['Steel Grey'],
  },

  // Plumbing & Sanitary
  plumbing: {
    label: 'Plumbing & Bath Fittings',
    fields: ['size', 'thickness', 'type', 'grade', 'pack_size', 'material', 'color'],
    thickness: ['SDR 11', 'SDR 13.5', 'SCH 40', 'SCH 80', 'Class 1', 'Class 2'],
    size: ['1/2 inch (15mm)', '3/4 inch (20mm)', '1 inch (25mm)', '1.25 inch (32mm)', '1.5 inch (40mm)', '2 inch (50mm)', '3 inch (75mm)', '4 inch (110mm)'],
    pack_size: ['Single Piece', 'Pack of 5', 'Pack of 10', 'Box of 20'],
    type: ['CPVC Pipe', 'UPVC Pipe', 'SWR Drainage Pipe', 'PPR Pipe', 'Wall Mixer', 'Overhead Shower', 'Health Faucet', 'Kitchen Sink', 'Water Closet / Commode'],
    grade: ['SDR 11 Heavy Duty', 'SDR 13.5 Standard', 'Schedule 40', 'Schedule 80', 'ISI Certified'],
    material: ['Chlorinated PVC (CPVC)', 'Unplasticized PVC (UPVC)', 'Brass', 'Stainless Steel 304', 'Ceramic Vitreous China'],
    color: ['Chrome Silver', 'Matte Black', 'White', 'Ivory', 'Rose Gold', 'Brushed Nickel'],
  },

  // Electrical & Lighting
  electrical: {
    label: 'Electrical & Lighting',
    fields: ['size', 'type', 'grade', 'pack_size', 'color', 'material'],
    thickness: [],
    size: ['1.0 sq mm', '1.5 sq mm', '2.5 sq mm', '4.0 sq mm', '6.0 sq mm', '6A', '16A', '20A', '32A', '9W', '12W', '15W', '18W', '22W'],
    pack_size: ['90m Coil', '180m Coil', 'Pack of 10', 'Pack of 20', 'Single Piece'],
    type: ['Modular Switch', 'Power Socket', 'MCB (Miniature Circuit Breaker)', 'Distribution Board (DB)', 'LED Panel Light', 'COB Spotlight', 'FR-LSH Wire', 'Conduit Pipe'],
    grade: ['FR (Flame Retardant)', 'FR-LSH (Low Smoke Halogen)', 'C-Curve MCB', 'B-Curve MCB', 'ISI 694'],
    material: ['Fire Retardant Polycarbonate', 'Electrolytic Copper', 'Aluminium Housing'],
    color: ['White', 'Matte Black', 'Dark Grey', 'Silver Grey', 'Warm White 3000K', 'Natural White 4000K', 'Cool Daylight 6500K'],
  },

  // Furniture & Architectural Hardware
  hardware: {
    label: 'Hardware & Fittings',
    fields: ['size', 'thickness', 'type', 'grade', 'pack_size', 'material', 'color'],
    thickness: ['1.5mm', '2.0mm', '2.5mm', '3.0mm', '45mm channel'],
    size: ['4 inch', '6 inch', '8 inch', '10 inch', '12 inch', '14 inch', '16 inch', '18 inch', '20 inch', '24 inch'],
    pack_size: ['Pair (2 Pcs)', 'Box of 10 Pairs', 'Pack of 50', 'Single Piece'],
    type: ['Soft-Close Concealed Hinges', 'Telescopic Drawer Slides', 'Slim Box / Tandem Drawer', 'Mortise Door Handle & Lock', 'Cabinet Knob / Handle', 'Hydraulic Bed Lift', 'Glass Door Hinges'],
    grade: ['Grade 304 (Corrosion Proof)', 'Grade 201 Standard', 'Soft Close Hydraulic', 'Heavy Duty 45kg'],
    material: ['Stainless Steel 304', 'Stainless Steel 201', 'Zinc Alloy (Zamak)', 'Solid Brass', 'Aluminium'],
    color: ['SS Matte Finish', 'Glossy Chrome', 'Matte Black', 'Rose Gold', 'Antique Brass', 'PVD Gold'],
  },

  // Paints & Waterproofing
  paints: {
    label: 'Paints & Waterproofing',
    fields: ['pack_size', 'type', 'grade', 'color', 'size', 'material'],
    thickness: [],
    pack_size: ['1 Litre', '4 Litre', '10 Litre', '20 Litre', '1 Kg', '5 Kg', '20 Kg', '50 Kg'],
    size: ['1L', '4L', '10L', '20L', '1kg', '5kg', '20kg'],
    type: ['Interior Luxury Emulsion', 'Exterior Weatherproof Emulsion', 'Acrylic Distemper', 'PU Enamel Paint', 'Waterproof Membrane Coating', 'Wall Putty', 'Tile Adhesive / Epoxy Grout', 'Damp Proof Superflex'],
    grade: ['Exterior 10 Year Warranty', 'Exterior 5 Year Warranty', 'Interior Advance Sheen', 'Superflex Waterproof', 'Plastering Primer'],
    material: ['100% Acrylic Latex', 'Polymer Modified Cement', 'Silicone Elastomeric', 'Epoxy Resin'],
    color: ['White', 'Off-White', 'Ivory', 'Light Grey', 'Warm Beige', 'Sky Blue', 'Mint Green', 'Clear / Transparent'],
  },

  // Fallback General Configuration
  general: {
    label: 'All Materials',
    fields: ['thickness', 'size', 'type', 'grade', 'pack_size', 'color', 'material'],
    thickness: ['4mm', '6mm', '8mm', '9mm', '12mm', '16mm', '18mm', '25mm'],
    size: ['Standard', '600x600 mm', '600x1200 mm', "8' X 4'", '1 Litre', '50 kg'],
    pack_size: ['50 Kg Bag', '20 Kg Bag', '25 Kg Bag', '1 Litre', '4 Litre', '20 Litre', '1 Sheet', 'Piece'],
    type: ['Standard', 'Premium', 'Commercial', 'Waterproof', 'Heavy Duty'],
    grade: ['Standard Grade', 'Premium Grade', 'Waterproof Grade', 'Commercial Grade'],
    material: ['Steel', 'Wood / Plywood', 'Ceramic', 'PVC / CPVC', 'Polycarbonate', 'Brass', 'Cement'],
    color: ['White', 'Black', 'Grey', 'Brown', 'Chrome Silver', 'Natural Wood'],
  },
};

/**
 * Resolves the attribute config for a given category/subcategory.
 */
export function getCategoryAttributeConfig(category = '', subcategory = '') {
  const norm = `${category} ${subcategory}`.toLowerCase();

  if (/tile|marble|granite|flooring/.test(norm)) return CATEGORY_ATTRIBUTE_MAP.tiles;
  if (/plywood|ply|timber|board|hdhmr|mdf|laminate|hpl|carpentry|veneer/.test(norm)) return CATEGORY_ATTRIBUTE_MAP.carpentry;
  if (/steel|iron|tmt|rebar|metal/.test(norm)) return CATEGORY_ATTRIBUTE_MAP.steel;
  if (/plumb|pipe|sanitary|faucet|sink|shower|cpvc|upvc|pvc/.test(norm)) return CATEGORY_ATTRIBUTE_MAP.plumbing;
  if (/electr|light|wire|cable|switch|socket|mcb|db/.test(norm)) return CATEGORY_ATTRIBUTE_MAP.electrical;
  if (/hardware|hinge|channel|handle|lock|fitting/.test(norm)) return CATEGORY_ATTRIBUTE_MAP.hardware;
  if (/paint|colour|distemper|waterproof|primer|putty|adhesive|chemical|fevicol/.test(norm)) return CATEGORY_ATTRIBUTE_MAP.paints;
  if (/building|cement|brick|block|aggregate|sand/.test(norm)) return CATEGORY_ATTRIBUTE_MAP['building-materials'];

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

  // Fallback regex extraction if not explicitly set in specifications
  if (!thickness) {
    const match = textToScan.match(/(?:^|\s|\()(\d+(?:\.\d+)?\s*(?:mm|gauge|sdr\s*\d+))\b/i);
    if (match) thickness = match[1].replace(/\s+/g, '');
  }

  if (!size) {
    const match = textToScan.match(/(?:^|\s|\()(\d+\s*['xX]\s*\d+\s*(?:ft|feet|mm|cm|inch|in|')?)\b/i);
    if (match) size = match[1].replace(/\s+/g, '');
  }

  if (!pack_size) {
    const match = textToScan.match(/(?:^|\s|\(|,\s*)(\d+(?:\.\d+)?\s*(?:kg\s*bag|kg|litre|ltr|l|gm|grams|ml|ton|bag))\b/i);
    if (match) pack_size = match[1].replace(/\s+/g, ' ');
  }

  if (!grade) {
    const match = textToScan.match(/(?:^|\s|\()(mr\s*303|mr\s*grade|bwp\s*710|bwp\s*marine|bwp|bwr|is\s*:?\s*303|is\s*:?\s*710|opc\s*53|opc\s*43|ppc|fe\s*500d|fe\s*550d|boilo|p-sand|m-sand)\b/i);
    if (match) grade = match[1].toUpperCase();
  }

  return { thickness, size, type, color, material, grade, pack_size };
}

/**
 * Tests whether a product matches a given attribute filter.
 */
export function matchesAttribute(product, filterKey, filterVal) {
  if (!filterVal || filterVal === 'all') return true;

  const attrs = extractProductAttributes(product);
  const targetNorm = normalizeAttributeValue(filterVal);

  const productVal = attrs[filterKey];
  if (productVal && normalizeAttributeValue(productVal) === targetNorm) {
    return true;
  }

  // Also check product name, description, and raw specifications
  const specs = product.specifications && typeof product.specifications === 'object' ? product.specifications : {};
  for (const [key, val] of Object.entries(specs)) {
    if (normalizeAttributeValue(key).includes(normalizeAttributeValue(filterKey)) && normalizeAttributeValue(val) === targetNorm) {
      return true;
    }
  }

  // Check product name/desc for exact token match
  const rawText = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  if (rawText.includes(filterVal.toLowerCase())) {
    return true;
  }

  return false;
}

/**
 * Aggregates all unique attribute values available across an array of products.
 */
export function collectUniqueAttributes(products = [], currentCategory = '', currentSub = '') {
  const thicknesses = new Set();
  const sizes = new Set();
  const types = new Set();
  const colors = new Set();
  const materials = new Set();
  const grades = new Set();
  const packSizes = new Set();

  products.forEach((product) => {
    const { thickness, size, type, color, material, grade, pack_size } = extractProductAttributes(product);
    if (thickness) thicknesses.add(thickness);
    if (size) sizes.add(size);
    if (type) types.add(type);
    if (color) colors.add(color);
    if (material) materials.add(material);
    if (grade) grades.add(grade);
    if (pack_size) packSizes.add(pack_size);
  });

  // Also include preset options for the currently selected category if available
  const config = getCategoryAttributeConfig(currentCategory, currentSub);

  return {
    thicknesses: Array.from(new Set([...Array.from(thicknesses), ...(config.thickness || [])])).filter(Boolean),
    sizes: Array.from(new Set([...Array.from(sizes), ...(config.size || [])])).filter(Boolean),
    types: Array.from(new Set([...Array.from(types), ...(config.type || [])])).filter(Boolean),
    colors: Array.from(new Set([...Array.from(colors), ...(config.color || [])])).filter(Boolean),
    materials: Array.from(new Set([...Array.from(materials), ...(config.material || [])])).filter(Boolean),
    grades: Array.from(new Set([...Array.from(grades), ...(config.grade || [])])).filter(Boolean),
    packSizes: Array.from(new Set([...Array.from(packSizes), ...(config.pack_size || [])])).filter(Boolean),
  };
}
