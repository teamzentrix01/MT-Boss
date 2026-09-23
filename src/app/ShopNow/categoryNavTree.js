/** Static HomeRun-style parent → child nav for the shop category bar. */

export const CATEGORY_NAV_TREE = [
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
];

/** Map nav leaf labels → alternate live shop_categories.name values. */
export const CATEGORY_NAV_ALIASES = {
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
  const productCategory = product?.category || '';
  const productName = product?.name || '';
  const leaf = normalizeName(leafLabel);
  const parent = normalizeName(parentLabel);

  if (namesMatch(productCategory, leafLabel) || namesMatch(productName, leafLabel)) return true;

  // Product filed under parent category (e.g. category "plumbing", name "CPVC pipes")
  const underParent = namesMatch(productCategory, parentLabel)
    || (parent && normalizeName(productCategory).includes(parent));
  if (!underParent) return false;

  return namesMatch(productName, leafLabel)
    || leaf.split(' ').filter((part) => part.length > 2).every((part) => normalizeName(productName).includes(part));
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

  return { label, categoryId: null, search: '', disabled: true };
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
          && parentCategory.subcategories.some((entry) => namesMatch(entry, label));
        if (parentCategory && listedInParent) {
          return {
            label,
            categoryId: parentCategory.id,
            search: label,
            disabled: false,
          };
        }

        return {
          label,
          categoryId: null,
          search: '',
          disabled: true,
        };
      }),
    };
  });
}
