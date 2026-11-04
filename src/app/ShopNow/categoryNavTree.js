export const CATEGORY_NAV_TREE = [
  {
    id: 'new-launches',
    label: 'New Launches',
    children: [
      'Cabinet Hardware',
      'Kitchen Systems & Hardware',
      'General Hardware & Tools',
      'Bathroom Renovation Materials',
      'Conduits & Piping',
      'PVC Pipes',
      'Kitchen Sinks & Faucets',
      'Home Appliances & Power Backup',
    ],
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

export function namesMatch(a, b) {
  const left = normalizeName(a);
  const right = normalizeName(b);
  if (!left || !right) return false;
  if (left === right || left.includes(right) || right.includes(left)) return true;
  const leftKey = nameKey(a);
  const rightKey = nameKey(b);
  return Boolean(leftKey && rightKey && (leftKey === rightKey || leftKey.includes(rightKey) || rightKey.includes(leftKey)));
}

export function findCategoryByLabel(label, categories) {
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

export function productMatchesLeaf(product, leafLabel, parentLabel) {
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

    const childrenLabels = [...parent.children];
    if (parentCategory) {
      let rawSubs = parentCategory.subcategories;
      if (typeof rawSubs === 'string') {
        try { rawSubs = JSON.parse(rawSubs); } catch {}
      }
      if (Array.isArray(rawSubs)) {
        rawSubs.forEach((entry) => {
          const name = typeof entry === 'object' && entry !== null ? entry.name : entry;
          if (name && typeof name === 'string' && !childrenLabels.some((l) => namesMatch(l, name))) {
            childrenLabels.push(name.trim());
          }
        });
      }
      let rawTypes = parentCategory.types;
      if (typeof rawTypes === 'string') {
        try { rawTypes = JSON.parse(rawTypes); } catch {}
      }
      if (Array.isArray(rawTypes)) {
        rawTypes.forEach((entry) => {
          if (entry && typeof entry === 'string' && !childrenLabels.some((l) => namesMatch(l, entry))) {
            childrenLabels.push(entry.trim());
          }
        });
      }
    }

    return {
      id: parent.id,
      label: parent.label,
      children: childrenLabels.map((label) => {
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

export const MAIN_NAV_DEFINITIONS = [
  {
    id: 'new-launches',
    name: 'New Launches',
    label: 'New Launches',
    description: 'Explore the latest arrivals, tools, hardware & materials',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    tone: 'blue',
  },
  {
    id: 'building-materials',
    name: 'Building Materials',
    label: 'Building Materials',
    description: 'Cement, TMT Steel, Bricks, Sand, Blocks, Tiles, Waterproofing',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    tone: 'sand',
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    label: 'Carpentry',
    description: 'Plywood, Timber, HPL Laminates, Rough Carpentry',
    coverImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
    tone: 'coral',
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    label: 'Plumbing',
    description: 'CPVC Pipes, Sanitary, Bath Fittings, Overhead Tanks',
    coverImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80',
    tone: 'mint',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    label: 'Electrical',
    description: 'Switches, Sockets, MCBs, DBs, LED Lights, Cables',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    tone: 'lavender',
  },
  {
    id: 'furniture-architectural-hardware',
    name: 'Furniture & Architectural Hardware',
    label: 'Furniture & Architectural Hardware',
    description: 'Hinges, Channels, Handles, Locks, Wardrobe & Kitchen Systems',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    tone: 'green',
  },
  {
    id: 'chemicals',
    name: 'Chemicals',
    label: 'Chemicals',
    description: 'Construction chemicals, adhesives, sealants & admixtures',
    coverImage: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&q=80',
    tone: 'mint',
    isDirect: true,
  },
  {
    id: 'paints',
    name: 'Paints',
    label: 'Paints',
    description: 'Interior, exterior paints, primers & coatings',
    coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    tone: 'coral',
    isDirect: true,
  },
];

export function getMainCategories(categories = [], products = []) {
  return MAIN_NAV_DEFINITIONS.map((def) => {
    const parentInTree = CATEGORY_NAV_TREE.find((t) => t.id === def.id || namesMatch(t.label, def.label));
    const dbCat = findCategoryByLabel(def.label, categories);

    let images = [];
    if (dbCat?.image) images.push(dbCat.image);
    if (Array.isArray(dbCat?.images)) images.push(...dbCat.images);

    // If no direct image in dbCat, check if subcategory has an image (e.g. Building Materials -> Cement)
    if (images.length === 0 && parentInTree?.children?.length > 0) {
      for (const childLabel of parentInTree.children) {
        const childCat = findCategoryByLabel(childLabel, categories);
        if (childCat?.image) {
          images.push(childCat.image);
          break;
        }
      }
    }

    if (images.length === 0 && def.coverImage) {
      images.push(def.coverImage);
    }
    images = Array.from(new Set(images.filter(Boolean)));

    const children = parentInTree ? [...parentInTree.children] : [];
    if (dbCat) {
      let rawSubs = dbCat.subcategories;
      if (typeof rawSubs === 'string') {
        try { rawSubs = JSON.parse(rawSubs); } catch {}
      }
      if (Array.isArray(rawSubs)) {
        rawSubs.forEach((entry) => {
          const name = typeof entry === 'object' && entry !== null ? entry.name : entry;
          if (name && typeof name === 'string' && !children.some((c) => namesMatch(c, name))) {
            children.push(name.trim());
          }
        });
      }
    }

    return {
      ...def,
      dbId: dbCat?.id ?? null,
      children,
      image: images[0] || def.coverImage,
      images,
    };
  });
}

export function getSubcategoriesForParent(parentDefOrLabel, categories = [], products = []) {
  let parent = null;
  if (typeof parentDefOrLabel === 'string') {
    parent = MAIN_NAV_DEFINITIONS.find((d) => d.id === parentDefOrLabel || namesMatch(d.label, parentDefOrLabel))
      || CATEGORY_NAV_TREE.find((t) => t.id === parentDefOrLabel || namesMatch(t.label, parentDefOrLabel));
  } else {
    parent = parentDefOrLabel;
  }
  if (!parent) return [];

  const parentTree = CATEGORY_NAV_TREE.find((t) => t.id === parent.id || namesMatch(t.label, parent.label));
  const parentDb = findCategoryByLabel(parent.label, categories);

  const labels = parentTree ? [...parentTree.children] : (parent.children ? [...parent.children] : []);
  if (parentDb) {
    let rawSubs = parentDb.subcategories;
    if (typeof rawSubs === 'string') {
      try { rawSubs = JSON.parse(rawSubs); } catch {}
    }
    if (Array.isArray(rawSubs)) {
      rawSubs.forEach((entry) => {
        const name = typeof entry === 'object' && entry !== null ? entry.name : entry;
        if (name && typeof name === 'string' && !labels.some((l) => namesMatch(l, name))) {
          labels.push(name.trim());
        }
      });
    }
  }

  return labels.map((label) => {
    const childDb = findCategoryByLabel(label, categories);
    let images = [];
    if (childDb?.image) images.push(childDb.image);
    if (Array.isArray(childDb?.images)) images.push(...childDb.images);

    if (images.length === 0) {
      const matchProd = products.find((p) => productMatchesLeaf(p, label, parent.label));
      if (matchProd?.image_url || matchProd?.image) {
        images.push(matchProd.image_url || matchProd.image);
      }
    }

    images = Array.from(new Set(images.filter(Boolean)));
    const matchingProductsCount = products.filter((p) => productMatchesLeaf(p, label, parent.label)).length;

    return {
      id: childDb?.id ?? `sub-${normalizeName(label).replace(/[^a-z0-9]+/g, '-')}`,
      name: label,
      label,
      parentLabel: parent.label,
      parentId: parent.id,
      image: images[0] || '',
      images,
      count: matchingProductsCount,
      categoryId: childDb?.id ?? null,
    };
  });
}

export function productMatchesParent(product, parentLabel, allParents = MAIN_NAV_DEFINITIONS) {
  if (!product || !parentLabel) return false;
  const prodCat = typeof product.category === 'object' ? product.category?.name || '' : (product.category || '');
  if (namesMatch(prodCat, parentLabel)) return true;

  const parent = allParents.find((p) => namesMatch(p.label, parentLabel) || p.id === parentLabel)
    || CATEGORY_NAV_TREE.find((t) => namesMatch(t.label, parentLabel) || t.id === parentLabel);
  if (!parent) return false;

  const children = parent.children || [];
  return children.some((child) => productMatchesLeaf(product, child, parent.label));
}

export function productMatchesCategoryAndSub(product, parentLabel, subLabel, allParents = MAIN_NAV_DEFINITIONS) {
  if (!product) return false;
  if (subLabel) {
    return productMatchesLeaf(product, subLabel, parentLabel || subLabel);
  }
  if (parentLabel && parentLabel !== 'all') {
    return productMatchesParent(product, parentLabel, allParents);
  }
  return true;
}

export function resolveParentAndSubFromParam(categoryParam, subParam, categories = []) {
  if (!categoryParam && !subParam) {
    return { parentLabel: null, subLabel: null, isParent: false };
  }

  if (categoryParam && subParam) {
    return { parentLabel: categoryParam, subLabel: subParam, isParent: false };
  }

  // Only categoryParam is provided
  const mainMatch = MAIN_NAV_DEFINITIONS.find(
    (m) => namesMatch(m.label, categoryParam) || m.id === categoryParam
  );
  if (mainMatch) {
    if (mainMatch.isDirect) {
      return { parentLabel: mainMatch.label, subLabel: mainMatch.label, isParent: false };
    }
    return { parentLabel: mainMatch.label, subLabel: null, isParent: true };
  }

  // Check if categoryParam is actually a subcategory (e.g. legacy ?category=Cement)
  for (const main of MAIN_NAV_DEFINITIONS) {
    const tree = CATEGORY_NAV_TREE.find((t) => t.id === main.id || namesMatch(t.label, main.label));
    const children = tree?.children || main.children || [];
    if (children.some((c) => namesMatch(c, categoryParam))) {
      return { parentLabel: main.label, subLabel: categoryParam, isParent: false };
    }
  }

  // Fallback: check direct DB category
  const dbCat = findCategoryByLabel(categoryParam, categories);
  if (dbCat) {
    return { parentLabel: dbCat.name, subLabel: dbCat.name, isParent: false };
  }

  return { parentLabel: categoryParam, subLabel: null, isParent: true };
}
