export const CATEGORY_NAV_TREE = [
  {
    id: 'new-launches',
    label: 'New Launches',
    children: [],
  },
  {
    id: 'building-materials',
    label: 'Building Materials',
    children: [
      'Cement',
      'Iron',
      'Steel',
      'Aggregate (Barjri)',
      'Coarse Sand',
      'Fine Sand',
      'Brick',
      'Block',
      'POP',
      'Tiles',
      'Marble',
      'Glass',
      'Waterproofing',
    ],
  },
  {
    id: 'carpentry',
    label: 'Carpentry',
    children: ['Timber', 'Plywood', 'HPL', 'Rough Carpentry'],
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    children: ['CPVC Pipes', 'Sanitary', 'Bath Fittings', 'Overhead Tanks'],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    children: [
      'Sockets',
      'Switches',
      'MCB',
      'Distribution Board (DB)',
      'LED Lights',
      'Electrical Cables',
    ],
  },
  {
    id: 'furniture-architectural-hardware',
    label: 'Furniture & Architectural Hardware',
    children: [
      'Hinges, Channels & Handles',
      'Kitchen Systems & Accessories',
      'Wardrobe & Bed Fittings',
      'Door Locks & Hardware',
    ],
  },
];

/** Map nav leaf labels → alternate live shop_categories.name values. */
export const CATEGORY_NAV_ALIASES = {
  'new launches': ['new launches', 'new launch', 'new arrivals', 'new arrival', 'new ariable', 'new', 'arrivals'],
  'new arrivals': ['new arrivals', 'new arrival', 'new launches', 'new launch', 'new ariable'],
  'cabinet hardware': ['cabinet hardware', 'cabinet', 'cabinets'],
  'kitchen systems & hardware': ['kitchen systems & hardware', 'kitchen systems and hardware', 'kitchen systems', 'kitchen hardware'],
  'general hardware & tools': ['general hardware & tools', 'general hardware and tools', 'hardware & tools', 'tools', 'general hardware'],
  'bathroom renovation materials': ['bathroom renovation materials', 'bathroom renovation', 'bathroom materials', 'bathroom', 'sanitary'],
  'conduits & piping': ['conduits & piping', 'conduits and piping', 'conduits', 'conduit', 'piping', 'conduit pipes'],
  'pvc pipes': ['pvc pipes', 'pvc pipe', 'pvc', 'upvc pipes', 'cpvc pipes', 'pipe', 'pipes'],
  'kitchen sinks & faucets': ['kitchen sinks & faucets', 'kitchen sinks and faucets', 'kitchen sinks', 'kitchen sink', 'faucets', 'sink', 'sinks'],
  'home appliances & power backup': ['home appliances & power backup', 'home appliances and power backup', 'home appliances', 'appliances', 'power backup', 'inverter', 'battery'],
  'furniture & architectural hardware': ['furniture & architectural hardware', 'furniture and architectural hardware', 'architectural hardware', 'furniture hardware'],
  'hinges, channels & handles': ['hinges, channels & handles', 'hinges channels & handles', 'hinges channels handles', 'hinges', 'channels', 'handles'],
  'kitchen systems & accessories': ['kitchen systems & accessories', 'kitchen systems and accessories', 'kitchen systems', 'kitchen accessories'],
  'wardrobe & bed fittings': ['wardrobe & bed fittings', 'wardrobe and bed fittings', 'wardrobe fittings', 'bed fittings'],
  'door locks & hardware': ['door locks & hardware', 'door locks and hardware', 'door locks', 'door lock', 'locks'],
  timber: ['timber (lakdi)', 'timber(lakdi)'],
  brick: ['bricks'],
  block: ['blocks', 'aac block', 'aac blocks'],
  iron: ['steel', 'tmt', 'tmt bar', 'tmt bars'],
  steel: ['iron', 'tmt', 'tmt bar', 'tmt bars'],
  tiles: ['tile'],
  marble: ['marbles', 'marbale', 'marbales'],
  paints: ['paint', 'painting'],
  pop: ['p.o.p', 'plaster of paris'],
  waterproofing: ['water proofing', 'waterproof'],
  chemicals: ['chemical', 'construction chemicals'],
  plywood: ['ply', 'ply wood'],
  hpl: ['high pressure laminate', 'laminate'],
  sockets: ['socket', 'switches & sockets', 'switch & socket'],
  switches: ['switch', 'switches & sockets', 'switch & socket'],
  mcb: ['mcbs', 'mcb & distribution boards', 'miniature circuit breaker'],
  'distribution board (db)': ['distribution board', 'db', 'distribution boards', 'mcb & distribution boards'],
  'led lights': ['led light', 'led', 'lighting', 'lights', 'light'],
  'electrical cables': ['electrical cable', 'cables', 'cable', 'wires', 'wire', 'wiring'],
  'aggregate (barjri)': ['aggregate ( barjri)', 'aggregate(barjri)', 'barjri', 'bajri', 'aggregate (bajri)'],
  'coarse sand': ['course sand'],
  'fine sand': ['finesand'],
};

/** Normalize for display/compare: collapse spaces and trim around punctuation. */
export function normalizeName(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\s*([()&/,.-])\s*/g, '$1');
}

/** Alphanumeric fingerprint so "Aggregate ( Barjri)" === "Aggregate (Barjri)". */
function nameKey(value = '') {
  return normalizeName(value).replace(/[^a-z0-9]+/g, '');
}

function namesMatch(a, b) {
  const left = normalizeName(a);
  const right = normalizeName(b);
  if (!left || !right) return false;
  if (left === right || left.includes(right) || right.includes(left)) return true;
  const leftKey = nameKey(a);
  const rightKey = nameKey(b);
  return Boolean(leftKey && rightKey && (leftKey === rightKey || leftKey.includes(rightKey) || rightKey.includes(leftKey)));
}

function findCategoryByLabel(label, categories) {
  const target = normalizeName(label);
  const targetKey = nameKey(label);
  if (!target) return null;

  const exact = categories.find((category) => {
    const name = normalizeName(category.name);
    return name === target || nameKey(category.name) === targetKey;
  });
  if (exact) return exact;

  const aliases = CATEGORY_NAV_ALIASES[target] || [];
  const aliasKeys = aliases.map((alias) => nameKey(alias));
  return categories.find((category) => {
    const name = normalizeName(category.name);
    const key = nameKey(category.name);
    return aliases.includes(name) || aliasKeys.includes(key) || namesMatch(category.name, label);
  }) || null;
}

function productMatchesLeaf(product, leafLabel, parentLabel) {
  const productCategory = typeof product?.category === 'object' ? product?.category?.name || '' : (product?.category || '');
  const productName = product?.name || '';
  const productSubcategory = product?.subcategory || '';
  const leaf = normalizeName(leafLabel);
  const parent = normalizeName(parentLabel);

  if (namesMatch(productCategory, leafLabel) || namesMatch(productName, leafLabel) || namesMatch(productSubcategory, leafLabel)) return true;

  // Check aliases
  const aliases = CATEGORY_NAV_ALIASES[leaf] || [];
  if (aliases.some((alias) => namesMatch(productSubcategory, alias) || namesMatch(productName, alias))) {
    return true;
  }

  // Product filed under parent category (e.g. category "Furniture & Architectural Hardware", subcategory "Hinges")
  const underParent = namesMatch(productCategory, parentLabel)
    || (parent && normalizeName(productCategory).includes(parent));
  if (!underParent) return false;

  return namesMatch(productName, leafLabel)
    || namesMatch(productSubcategory, leafLabel)
    || leaf.split(/[\s,&/]+/).filter((part) => part.length > 2).some((part) =>
      normalizeName(productName).includes(part) || normalizeName(productSubcategory).includes(part)
    );
}

/**
 * Resolve a single top-level nav button (no dropdown), e.g. Paints.
 */
export function resolveDirectNavItem(label, categories = [], products = []) {
  const exactCategory = findCategoryByLabel(label, categories);
  if (exactCategory) {
    return { label, categoryId: exactCategory.id, search: '', disabled: false };
  }

  const matchingProducts = products.filter((product) => productMatchesLeaf(product, label, label));
  if (matchingProducts.length) {
    const fromProduct = findCategoryByLabel(matchingProducts[0].category, categories);
    if (fromProduct) {
      return { label, categoryId: fromProduct.id, search: '', disabled: false };
    }
  }

  return { label, categoryId: 'all', search: label, disabled: false };
}

/** Top-level nav buttons without a dropdown (shown after parent menus; Paints last). */
export const DIRECT_NAV_BUTTONS = ['Chemicals', 'Paints'];

/**
 * Resolve the static tree against live shop categories and products.
 * Leaves enable when a matching category exists, or when products match the leaf
 * under the parent category (e.g. plumbing product named "CPVC pipes").
 */
export function resolveCategoryNav(tree = CATEGORY_NAV_TREE, categories = [], products = []) {
  return tree.map((parent) => {
    const parentCategory = findCategoryByLabel(parent.label, categories);

    return {
      id: parent.id,
      label: parent.label,
      children: parent.children.map((label) => {
        const exactCategory = findCategoryByLabel(label, categories);
        if (exactCategory) {
          return {
            label,
            categoryId: exactCategory.id,
            search: '',
            disabled: false,
          };
        }

        const matchingProducts = products.filter((product) => productMatchesLeaf(product, label, parent.label));
        if (matchingProducts.length) {
          const fromProduct = findCategoryByLabel(matchingProducts[0].category, categories);
          const categoryId = fromProduct?.id ?? parentCategory?.id ?? null;
          if (categoryId != null) {
            return {
              label,
              categoryId,
              // Narrow catalogue to the leaf when products live under a parent category
              search: parentCategory && String(categoryId) === String(parentCategory.id) ? label : '',
              disabled: false,
            };
          }
        }

        // Parent category exists and lists this label in its subcategories JSON
        const listedInParent = Array.isArray(parentCategory?.subcategories)
          && parentCategory.subcategories.some((entry) => namesMatch(typeof entry === 'object' && entry !== null ? entry.name : entry, label));
        if (parentCategory && listedInParent) {
          return {
            label,
            categoryId: parentCategory.id,
            search: label,
            disabled: false,
          };
        }

        // If parent category exists in DB, search under it
        if (parentCategory) {
          return {
            label,
            categoryId: parentCategory.id,
            search: label,
            disabled: false,
          };
        }

        // Fallback: active search under 'all'
        return {
          label,
          categoryId: 'all',
          search: label,
          disabled: false,
        };
      }),
    };
  });
}
