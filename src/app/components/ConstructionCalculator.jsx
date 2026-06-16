'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Check,
  ChevronDown,
  Hammer,
  Home,
  IndianRupee,
  Layers,
  Mail,
  MapPin,
  PackageCheck,
  PhoneCall,
  Ruler,
  Settings2,
  ShieldCheck,
  X,
} from 'lucide-react';

const CITIES = ['Moradabad', 'Noida', 'Delhi', 'Gurgaon', 'Ghaziabad', 'Lucknow', 'Agra', 'Mumbai'];

const CITY_RATES = {
  Moradabad: { labour: 310, transport: 18, multiplier: 0.94 },
  Noida: { labour: 380, transport: 24, multiplier: 1.08 },
  Delhi: { labour: 410, transport: 28, multiplier: 1.14 },
  Gurgaon: { labour: 430, transport: 30, multiplier: 1.18 },
  Ghaziabad: { labour: 360, transport: 22, multiplier: 1.02 },
  Lucknow: { labour: 340, transport: 20, multiplier: 0.98 },
  Agra: { labour: 330, transport: 19, multiplier: 0.96 },
  Mumbai: { labour: 520, transport: 42, multiplier: 1.35 },
};

const QUALITY_LEVELS = {
  Basic: {
    label: 'Basic',
    costMultiplier: 0.92,
    labourMultiplier: 0.9,
    finishMultiplier: 0.82,
    note: 'Rental-friendly structure with budget finishes',
  },
  Standard: {
    label: 'Standard',
    costMultiplier: 1,
    labourMultiplier: 1,
    finishMultiplier: 1,
    note: 'Balanced home construction package',
  },
  Premium: {
    label: 'Premium',
    costMultiplier: 1.16,
    labourMultiplier: 1.14,
    finishMultiplier: 1.28,
    note: 'Branded materials and better finishing',
  },
  Luxury: {
    label: 'Luxury',
    costMultiplier: 1.34,
    labourMultiplier: 1.28,
    finishMultiplier: 1.65,
    note: 'High-end brands, richer fixtures and details',
  },
};

const FOUNDATION_TYPES = {
  Normal: { label: 'Normal foundation', materialMultiplier: 1, labourMultiplier: 1 },
  Raft: { label: 'Raft foundation', materialMultiplier: 1.14, labourMultiplier: 1.08 },
  Basement: { label: 'Basement', materialMultiplier: 1.32, labourMultiplier: 1.22 },
  Pile: { label: 'Pile foundation', materialMultiplier: 1.28, labourMultiplier: 1.18 },
};

const FLOOR_OPTIONS = [
  { label: 'Ground only', value: 1 },
  { label: 'G + 1', value: 2 },
  { label: 'G + 2', value: 3 },
  { label: 'G + 3', value: 4 },
];

const CATEGORY_SPECS = [
  {
    key: 'Steel',
    title: 'Steel',
    type: 'Mandatory',
    unit: 'kg',
    factor: 3.8,
    phase: 'Structure',
    fallbackPrice: 66,
    fallbackProducts: [
      { name: 'TATA Steel', price: 68, unit: 'kg' },
      { name: 'SAIL', price: 65, unit: 'kg' },
      { name: 'Rathi', price: 64, unit: 'kg' },
    ],
  },
  {
    key: 'Cement',
    title: 'Cement',
    type: 'Mandatory',
    unit: 'bag',
    factor: 0.42,
    phase: 'Structure',
    fallbackPrice: 410,
    fallbackProducts: [
      { name: 'UltraTech PPC', price: 420, unit: 'bag' },
      { name: 'ACC Cement', price: 405, unit: 'bag' },
      { name: 'Ambuja Cement', price: 430, unit: 'bag' },
    ],
  },
  {
    key: 'Bricks',
    title: 'Bricks / Blocks',
    type: 'Mandatory',
    unit: 'piece',
    factor: 8.2,
    phase: 'Masonry',
    fallbackPrice: 10,
    fallbackProducts: [
      { name: 'Red Brick', price: 9, unit: 'piece' },
      { name: 'Fly Ash Brick', price: 11, unit: 'piece' },
      { name: 'AAC Block Equivalent', price: 64, unit: 'piece', factorOverride: 1.45 },
    ],
  },
  {
    key: 'Sand',
    title: 'Reta / Sand',
    type: 'Mandatory',
    unit: 'cft',
    factor: 1.35,
    phase: 'Masonry',
    fallbackPrice: 48,
    fallbackProducts: [
      { name: 'River Sand', price: 54, unit: 'cft' },
      { name: 'M-Sand', price: 42, unit: 'cft' },
    ],
  },
  {
    key: 'Aggregate',
    title: 'Aggregate / Bajri',
    type: 'Mandatory',
    unit: 'cft',
    factor: 0.9,
    phase: 'Structure',
    fallbackPrice: 46,
    fallbackProducts: [
      { name: '20mm Aggregate', price: 46, unit: 'cft' },
      { name: '10mm Aggregate', price: 50, unit: 'cft' },
    ],
  },
  {
    key: 'Plumbing',
    title: 'Plumbing',
    type: 'Recommended',
    unit: 'set',
    factor: 0.012,
    phase: 'Services',
    fallbackPrice: 4600,
    fallbackProducts: [
      { name: 'Ashirvad CPVC Pipes', price: 5200, unit: 'set' },
      { name: 'Standard CPVC Pipes', price: 3800, unit: 'set' },
    ],
  },
  {
    key: 'Wiring',
    title: 'Electrical Wiring',
    type: 'Recommended',
    unit: 'bundle',
    factor: 0.018,
    phase: 'Services',
    fallbackPrice: 2300,
    fallbackProducts: [
      { name: 'Havells Wiring Kit', price: 2400, unit: 'bundle' },
      { name: 'Anchor Wiring Kit', price: 2100, unit: 'bundle' },
    ],
  },
  {
    key: 'Putty',
    title: 'Wall Putty',
    type: 'Recommended',
    unit: 'bag',
    factor: 0.08,
    phase: 'Finishing',
    fallbackPrice: 790,
    fallbackProducts: [
      { name: 'JK Wall Putty', price: 780, unit: 'bag' },
      { name: 'Birla Wall Putty', price: 820, unit: 'bag' },
    ],
  },
  {
    key: 'Paints',
    title: 'Paint',
    type: 'Recommended',
    unit: 'bucket',
    factor: 0.035,
    phase: 'Finishing',
    fallbackPrice: 2750,
    fallbackProducts: [
      { name: 'Asian Paints', price: 2850, unit: 'bucket' },
      { name: 'Nerolac', price: 2750, unit: 'bucket' },
      { name: 'Dulux', price: 2600, unit: 'bucket' },
    ],
  },
  {
    key: 'Window',
    title: 'Windows',
    type: 'Recommended',
    unit: 'piece',
    factor: 0.012,
    phase: 'Finishing',
    fallbackPrice: 6500,
    fallbackProducts: [{ name: 'UPVC Window', price: 6500, unit: 'piece' }],
  },
  {
    key: 'Door',
    title: 'Doors',
    type: 'Recommended',
    unit: 'piece',
    factor: 0.01,
    phase: 'Finishing',
    fallbackPrice: 7200,
    fallbackProducts: [{ name: 'Flush Door', price: 7200, unit: 'piece' }],
  },
];

const DEFAULT_SETTINGS = {
  cityRates: CITY_RATES,
  qualityLevels: Object.fromEntries(
    Object.entries(QUALITY_LEVELS).map(([key, value]) => [
      key,
      {
        costMultiplier: value.costMultiplier,
        labourMultiplier: value.labourMultiplier,
        finishMultiplier: value.finishMultiplier,
      },
    ])
  ),
  foundationTypes: Object.fromEntries(
    Object.entries(FOUNDATION_TYPES).map(([key, value]) => [
      key,
      {
        materialMultiplier: value.materialMultiplier,
        labourMultiplier: value.labourMultiplier,
      },
    ])
  ),
  materialFactors: Object.fromEntries(CATEGORY_SPECS.map((spec) => [spec.key, spec.factor])),
};

function mergeCalculatorSettings(settings = {}) {
  return {
    cityRates: {
      ...DEFAULT_SETTINGS.cityRates,
      ...(settings.cityRates || {}),
    },
    qualityLevels: Object.fromEntries(
      Object.entries(QUALITY_LEVELS).map(([key, value]) => [
        key,
        { ...value, ...(settings.qualityLevels?.[key] || {}) },
      ])
    ),
    foundationTypes: Object.fromEntries(
      Object.entries(FOUNDATION_TYPES).map(([key, value]) => [
        key,
        { ...value, ...(settings.foundationTypes?.[key] || {}) },
      ])
    ),
    materialFactors: {
      ...DEFAULT_SETTINGS.materialFactors,
      ...(settings.materialFactors || {}),
    },
  };
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const formatNumber = (value) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);

function getProductPrice(product, city) {
  if (city && product.city_prices && typeof product.city_prices === 'object') {
    const price = product.city_prices[city];
    if (price !== undefined && price !== null && price !== '') return Number(price);
  }
  return Number(product.price || 0);
}

function normalizeProduct(product, spec, index) {
  return {
    ...product,
    id: product.id || `${spec.key}-fallback-${index}`,
    category: product.category || spec.key,
    unit: product.unit || spec.unit,
    badge: product.badge || spec.type,
    isFallback: !product.id,
  };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function makeEstimateSnapshot({ project, estimate, phaseTotals, quoteForm }) {
  return {
    customer: {
      name: quoteForm.name,
      email: quoteForm.email,
      phone: quoteForm.phone,
      address: quoteForm.address,
    },
    project: {
      city: project.city,
      propertySize: estimate.area,
      floors: estimate.floors,
      builtUpArea: estimate.builtUpArea,
      quality: project.quality,
      foundation: estimate.foundation.label,
    },
    totals: {
      grandTotal: estimate.grandTotal,
      perSqft: estimate.perSqft,
      materialTotal: estimate.materialTotal,
      labourTotal: estimate.labourTotal,
      transportTotal: estimate.transportTotal,
      supervisionTotal: estimate.supervisionTotal,
      contingencyTotal: estimate.contingencyTotal,
    },
    phaseTotals,
    lineItems: estimate.lineItems.map((item) => ({
      phase: item.spec.phase,
      category: item.spec.title,
      product: item.product?.name || item.spec.title,
      quantity: item.quantity,
      unit: item.product?.unit || item.spec.unit,
      rate: item.price,
      amount: item.amount,
    })),
  };
}

function buildReportHtml(snapshot) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const rows = snapshot.lineItems.map((item) => `
    <tr>
      <td>${escapeHtml(item.phase)}</td>
      <td>${escapeHtml(item.category)}</td>
      <td>${escapeHtml(item.product)}</td>
      <td>${formatNumber(item.quantity)} ${escapeHtml(item.unit)}</td>
      <td>${formatCurrency(item.rate)}</td>
      <td>${formatCurrency(item.amount)}</td>
    </tr>
  `).join('');

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>MTBoss Construction Budget Estimate</title>
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #f4f5f2; color: #111; font-family: Arial, sans-serif; }
        .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; padding: 20mm; }
        .top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #f2c51d; padding-bottom: 18px; }
        .brand { display: flex; gap: 12px; align-items: center; }
        .brand img { width: 58px; height: auto; }
        .brand h1 { margin: 0; font-size: 25px; letter-spacing: .02em; }
        .brand p, .meta p { margin: 3px 0; color: #555; font-size: 12px; }
        .meta { text-align: right; }
        .title { margin: 22px 0 12px; }
        .title h2 { margin: 0; font-size: 26px; }
        .title p { margin: 6px 0 0; color: #555; line-height: 1.5; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 16px 0; }
        .box { border: 1px solid #ddd; padding: 12px; background: #fafafa; }
        .box span { display: block; color: #777; font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: .08em; }
        .box strong { display: block; margin-top: 6px; font-size: 14px; }
        .total { background: #111; color: #fff; padding: 18px; margin: 18px 0; display: flex; justify-content: space-between; align-items: center; }
        .total span { color: #f2c51d; font-size: 12px; text-transform: uppercase; font-weight: 800; }
        .total strong { font-size: 30px; }
        h3 { margin: 22px 0 10px; font-size: 15px; text-transform: uppercase; letter-spacing: .08em; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #f2c51d; text-align: left; padding: 9px; color: #111; }
        td { border-bottom: 1px solid #e6e6e6; padding: 9px; vertical-align: top; }
        .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        .summary .box { background: #fff; }
        .line { display: flex; justify-content: space-between; gap: 18px; padding: 7px 0; border-bottom: 1px solid #eee; }
        .ad { margin-top: 20px; padding: 16px; background: #fff9dd; border: 1px solid #f2c51d; line-height: 1.55; }
        .disclaimer { margin-top: 18px; padding: 14px; border-left: 4px solid #111; background: #f5f5f5; color: #444; font-size: 11px; line-height: 1.55; }
        .footer { margin-top: 22px; padding-top: 16px; border-top: 2px solid #111; display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; font-size: 11px; color: #444; line-height: 1.55; }
        .footer strong { display: block; color: #111; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 5px; }
        .footer a { color: #111; font-weight: 800; text-decoration: none; border-bottom: 1px solid #f2c51d; }
        @media print { body { background: #fff; } .page { margin: 0; width: auto; min-height: auto; } }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="top">
          <div class="brand">
            <img src="/logo.png" alt="MTBoss" />
            <div>
              <h1>MTBoss Construction</h1>
              <p>Construction, materials, site execution and property services</p>
              <p>info@mtboss.in | +91 94584 10866</p>
            </div>
          </div>
          <div class="meta">
            <p><strong>Estimate Date</strong></p>
            <p>${today}</p>
            <p>Generated from Budget Calculator</p>
          </div>
        </div>

        <div class="title">
          <h2>Construction Budget Estimate</h2>
          <p>A preliminary BOQ-style estimate for ${escapeHtml(snapshot.customer.name)} based on selected city, area, floor count, quality package and material brands.</p>
        </div>

        <div class="grid">
          <div class="box"><span>Customer</span><strong>${escapeHtml(snapshot.customer.name)}</strong></div>
          <div class="box"><span>Mobile</span><strong>${escapeHtml(snapshot.customer.phone)}</strong></div>
          <div class="box"><span>Email</span><strong>${escapeHtml(snapshot.customer.email)}</strong></div>
          <div class="box"><span>Location</span><strong>${escapeHtml(snapshot.project.city)}</strong></div>
          <div class="box"><span>Property Size</span><strong>${formatNumber(snapshot.project.propertySize)} sqft</strong></div>
          <div class="box"><span>Floors</span><strong>${snapshot.project.floors}</strong></div>
          <div class="box"><span>Built-up Area</span><strong>${formatNumber(snapshot.project.builtUpArea)} sqft</strong></div>
          <div class="box"><span>Package</span><strong>${escapeHtml(snapshot.project.quality)}</strong></div>
        </div>

        <div class="box"><span>Site Address</span><strong>${escapeHtml(snapshot.customer.address)}</strong></div>

        <div class="total">
          <div><span>Total Approximate Budget</span><strong>${formatCurrency(snapshot.totals.grandTotal)}</strong></div>
          <div><span>Approx. Rate</span><strong>${formatCurrency(snapshot.totals.perSqft)} / sqft</strong></div>
        </div>

        <h3>Material BOQ</h3>
        <table>
          <thead><tr><th>Phase</th><th>Category</th><th>Selected Brand / Item</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="summary">
          <div class="box">
            <span>Phase Wise Cost</span>
            ${Object.entries(snapshot.phaseTotals).map(([phase, amount]) => `<div class="line"><b>${escapeHtml(phase)}</b><strong>${formatCurrency(amount)}</strong></div>`).join('')}
          </div>
          <div class="box">
            <span>Cost Summary</span>
            <div class="line"><b>Material Total</b><strong>${formatCurrency(snapshot.totals.materialTotal)}</strong></div>
            <div class="line"><b>Labour Cost</b><strong>${formatCurrency(snapshot.totals.labourTotal)}</strong></div>
            <div class="line"><b>Transport</b><strong>${formatCurrency(snapshot.totals.transportTotal)}</strong></div>
            <div class="line"><b>Supervision</b><strong>${formatCurrency(snapshot.totals.supervisionTotal)}</strong></div>
            <div class="line"><b>Contingency</b><strong>${formatCurrency(snapshot.totals.contingencyTotal)}</strong></div>
          </div>
        </div>

        <div class="ad">
          <strong>Next Step:</strong> MTBoss can arrange a site visit, detailed BOQ, material procurement support, vendor coordination, labour planning and end-to-end construction execution. Share this estimate with our team to convert it into a detailed project proposal.
        </div>

        <div class="disclaimer">
          <strong>Important Disclaimer:</strong> This budget is an approximate estimate generated from calculator assumptions, selected materials and city-level rates. Actual project value may vary after site visit, soil condition review, architectural/structural drawings, local material rates, labour availability, finishing choices, transport distance, statutory requirements and real site measurements. Final pricing should be confirmed only after an MTBoss site inspection and detailed technical assessment.
        </div>

        <div class="footer">
          <div>
            <strong>MTBoss Office</strong>
            Harthala Kanth Road Behind Kr Collection, near Domino's,<br />
            Uttar Pradesh, India
          </div>
          <div>
            <strong>Contact Us</strong>
            Phone: <a href="tel:+919458410866">+91 94584 10866</a><br />
            Email: <a href="mailto:info@mtboss.in">info@mtboss.in</a><br />
            Web: <a href="/contact">Contact Us</a>
          </div>
        </div>
      </div>
      <script>window.onload = () => setTimeout(() => window.print(), 250);</script>
    </body>
  </html>`;
}

export default function ConstructionCalculator() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(() => mergeCalculatorSettings());
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [project, setProject] = useState({
    city: 'Moradabad',
    area: 1000,
    floors: 2,
    quality: 'Standard',
    foundation: 'Normal',
  });
  const [selectedProducts, setSelectedProducts] = useState({});
  const [included, setIncluded] = useState(() =>
    CATEGORY_SPECS.reduce((acc, spec) => ({ ...acc, [spec.key]: spec.type === 'Mandatory' || spec.phase !== 'Finishing' }), {})
  );
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteStep, setQuoteStep] = useState('details');
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [siteImage, setSiteImage] = useState(null);
  const [quoteId, setQuoteId] = useState(null);
  const [otp, setOtp] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteMsg, setQuoteMsg] = useState('');
  const [devOtp, setDevOtp] = useState('');

  useEffect(() => {
    const fetchCalculatorData = async () => {
      try {
        const [productRes, settingsRes] = await Promise.all([
          fetch('/api/calculator-products', { cache: 'no-store' }),
          fetch('/api/calculator-settings', { cache: 'no-store' }),
        ]);
        const productData = await productRes.json();
        const settingsData = await settingsRes.json();
        if (productData.success) setProducts(productData.data || []);
        if (settingsData.success) setSettings(mergeCalculatorSettings(settingsData.data || {}));
      } finally {
        setLoading(false);
      }
    };
    fetchCalculatorData();
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(
        document.documentElement.classList.contains('dark-mode') ||
          localStorage.getItem('theme') === 'dark'
      );
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const productsByCategory = useMemo(() => {
    const map = new Map();
    CATEGORY_SPECS.forEach((spec) => {
      const fromApi = products
        .filter((product) => product.category?.toLowerCase() === spec.key.toLowerCase())
        .map((product, index) => normalizeProduct(product, spec, index));
      const fallback = spec.fallbackProducts.map((product, index) => normalizeProduct(product, spec, index));
      map.set(spec.key, fromApi.length > 0 ? fromApi : fallback);
    });
    return map;
  }, [products]);

  useEffect(() => {
    setSelectedProducts((current) => {
      const next = { ...current };
      CATEGORY_SPECS.forEach((spec) => {
        const options = productsByCategory.get(spec.key) || [];
        if (!next[spec.key] || !options.some((product) => String(product.id) === String(next[spec.key]))) {
          next[spec.key] = options[0]?.id;
        }
      });
      return next;
    });
  }, [productsByCategory]);

  const estimate = useMemo(() => {
    const cityRate = settings.cityRates[project.city] || settings.cityRates.Moradabad;
    const quality = settings.qualityLevels[project.quality] || settings.qualityLevels.Standard;
    const foundation = settings.foundationTypes[project.foundation] || settings.foundationTypes.Normal;
    const area = Math.max(Number(project.area) || 0, 1);
    const floors = Math.max(Number(project.floors) || 1, 1);
    const builtUpArea = area * floors;
    const floorWastage = 1 + Math.max(floors - 1, 0) * 0.035;

    const lineItems = CATEGORY_SPECS.filter((spec) => included[spec.key]).map((spec) => {
      const options = productsByCategory.get(spec.key) || [];
      const selected =
        options.find((product) => String(product.id) === String(selectedProducts[spec.key])) || options[0];
      const baseFactor = selected?.factorOverride || settings.materialFactors[spec.key] || spec.factor;
      const structureMultiplier = spec.phase === 'Structure' ? foundation.materialMultiplier : 1;
      const finishMultiplier = spec.phase === 'Finishing' ? quality.finishMultiplier : 1;
      const factor = baseFactor * structureMultiplier * floorWastage * finishMultiplier;
      const rawQuantity = builtUpArea * factor;
      const quantity = Math.max(Math.ceil(rawQuantity), 1);
      const basePrice = selected ? getProductPrice(selected, project.city) : spec.fallbackPrice;
      const price = Math.round(basePrice * cityRate.multiplier * quality.costMultiplier);
      const amount = quantity * price;

      return {
        spec,
        product: selected,
        quantity,
        price,
        amount,
      };
    });

    const materialTotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const labourBase = builtUpArea * cityRate.labour * quality.labourMultiplier * foundation.labourMultiplier;
    const labourTotal = Math.round(labourBase);
    const transportTotal = Math.round(builtUpArea * cityRate.transport);
    const supervisionTotal = Math.round((materialTotal + labourTotal) * 0.035);
    const contingencyTotal = Math.round((materialTotal + labourTotal + transportTotal) * 0.025);
    const grandTotal = materialTotal + labourTotal + transportTotal + supervisionTotal + contingencyTotal;

    return {
      area,
      floors,
      builtUpArea,
      lineItems,
      materialTotal,
      labourTotal,
      transportTotal,
      supervisionTotal,
      contingencyTotal,
      grandTotal,
      perSqft: grandTotal / builtUpArea,
      cityRate,
      quality,
      foundation,
    };
  }, [included, productsByCategory, project, selectedProducts, settings]);

  const phaseTotals = estimate.lineItems.reduce((acc, item) => {
    acc[item.spec.phase] = (acc[item.spec.phase] || 0) + item.amount;
    return acc;
  }, {});

  const updateProject = (key, value) => {
    setProject((current) => ({ ...current, [key]: value }));
  };

  const selectProduct = (categoryKey, productId) => {
    setSelectedProducts((current) => ({ ...current, [categoryKey]: productId }));
  };

  const toggleIncluded = (spec) => {
    if (spec.type === 'Mandatory') return;
    setIncluded((current) => ({ ...current, [spec.key]: !current[spec.key] }));
  };

  const openQuoteModal = () => {
    setQuoteOpen(true);
    setQuoteStep('details');
    setQuoteMsg('');
    setOtp('');
    setDevOtp('');
    setSiteImage(null);
  };

  const updateQuoteForm = (key, value) => {
    setQuoteForm((current) => ({ ...current, [key]: value }));
  };

  const requestQuoteOtp = async (e) => {
    e.preventDefault();
    setQuoteLoading(true);
    setQuoteMsg('');
    setDevOtp('');
    try {
      const snapshot = makeEstimateSnapshot({ project, estimate, phaseTotals, quoteForm });
      if (!siteImage) throw new Error('Please upload a site image.');
      const payload = new FormData();
      payload.append('action', 'request');
      payload.append('name', quoteForm.name);
      payload.append('email', quoteForm.email);
      payload.append('phone', quoteForm.phone);
      payload.append('address', quoteForm.address);
      payload.append('estimate', JSON.stringify(snapshot));
      payload.append('site_image', siteImage);
      const res = await fetch('/api/calculator-quote-otp', {
        method: 'POST',
        body: payload,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to send OTP');
      setQuoteId(data.quote_id);
      setQuoteStep('otp');
      setQuoteMsg(data.message || 'OTP sent. Verify to download the report.');
      if (data.dev_otp) setDevOtp(data.dev_otp);
    } catch (error) {
      setQuoteMsg(error.message);
    } finally {
      setQuoteLoading(false);
    }
  };

  const verifyQuoteOtp = async (e) => {
    e.preventDefault();
    setQuoteLoading(true);
    setQuoteMsg('');
    try {
      const res = await fetch('/api/calculator-quote-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', quote_id: quoteId, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'OTP verification failed');
      setQuoteStep('verified');
      setQuoteMsg('Verification complete. Your report is ready.');
    } catch (error) {
      setQuoteMsg(error.message);
    } finally {
      setQuoteLoading(false);
    }
  };

  const downloadVerifiedReport = () => {
    const snapshot = makeEstimateSnapshot({ project, estimate, phaseTotals, quoteForm });
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      setQuoteMsg('Please allow pop-ups to open the report download window.');
      return;
    }
    reportWindow.document.open();
    reportWindow.document.write(buildReportHtml(snapshot));
    reportWindow.document.close();
  };

  return (
    <>
      <style>{`
        .boq-page {
          --boq-bg: #f4f5f2;
          --boq-surface: #ffffff;
          --boq-soft: #eef0ec;
          --boq-line: #dfe3da;
          --boq-text: #1b1f1d;
          --boq-muted: #687069;
          --boq-accent: #d7a923;
          --boq-green: #1f7a4d;
          --boq-blue: #315f8c;
          min-height: 100vh;
          background: var(--boq-bg);
          color: var(--boq-text);
          font-family: Arial, sans-serif;
        }
        .dark-mode .boq-page,
        .boq-page.dark {
          --boq-bg: #0d0f0f;
          --boq-surface: #151817;
          --boq-soft: #202522;
          --boq-line: #2f3631;
          --boq-text: #f3f5f2;
          --boq-muted: #a7aea8;
        }
        .boq-hero {
          min-height: 260px;
          background-image: linear-gradient(90deg, rgba(10,14,13,.9), rgba(10,14,13,.62)), url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1800&q=80);
          background-size: cover;
          background-position: center;
          color: #fff;
          display: flex;
          align-items: flex-end;
          padding: 34px 20px 70px;
        }
        .boq-hero-inner { width: min(1180px, 100%); margin: 0 auto; }
        .boq-kicker { display: inline-flex; align-items: center; gap: 8px; color: #f8dc7e; font-size: .75rem; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
        .boq-hero h1 { margin: 12px 0 8px; max-width: 760px; font-size: clamp(2rem, 5vw, 4.4rem); line-height: .95; letter-spacing: 0; font-weight: 900; }
        .boq-hero p { max-width: 680px; margin: 0; color: rgba(255,255,255,.84); font-size: .98rem; line-height: 1.6; }
        .boq-shell { width: min(1180px, 100%); margin: -44px auto 0; padding: 0 20px 54px; }
        .boq-config {
          background: var(--boq-surface);
          border: 1px solid var(--boq-line);
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 1px;
          box-shadow: 0 22px 70px rgba(25,31,28,.14);
        }
        .boq-field { background: var(--boq-surface); padding: 16px; min-width: 0; }
        .boq-label { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; color: var(--boq-muted); font-size: .68rem; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
        .boq-select-wrap { position: relative; }
        .boq-input,
        .boq-select {
          width: 100%;
          height: 42px;
          border: 1px solid var(--boq-line);
          border-radius: 7px;
          background: var(--boq-soft);
          color: var(--boq-text);
          padding: 0 12px;
          font-size: .86rem;
          font-weight: 800;
          outline: none;
        }
        .boq-select { appearance: none; padding-right: 34px; }
        .boq-select-icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: var(--boq-muted); pointer-events: none; }
        .boq-size-wrap { position: relative; }
        .boq-size-wrap .boq-input { padding-right: 58px; }
        .boq-size-unit { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--boq-muted); font-size: .76rem; font-weight: 900; pointer-events: none; }
        .boq-layout { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 22px; margin-top: 24px; align-items: start; }
        .boq-panel { background: var(--boq-surface); border: 1px solid var(--boq-line); }
        .boq-panel-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px; border-bottom: 1px solid var(--boq-line); }
        .boq-panel-title { margin: 0; font-size: 1.05rem; font-weight: 900; letter-spacing: 0; }
        .boq-panel-sub { margin: 4px 0 0; color: var(--boq-muted); font-size: .78rem; line-height: 1.45; }
        .boq-chip { display: inline-flex; align-items: center; gap: 5px; height: 28px; border: 1px solid var(--boq-line); border-radius: 999px; padding: 0 10px; color: var(--boq-muted); background: var(--boq-soft); font-size: .72rem; font-weight: 900; white-space: nowrap; }
        .boq-quality-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 18px; }
        .boq-quality {
          min-height: 112px;
          border: 1px solid var(--boq-line);
          border-radius: 8px;
          background: var(--boq-soft);
          color: var(--boq-text);
          padding: 14px;
          cursor: pointer;
          text-align: left;
        }
        .boq-quality.active { border-color: var(--boq-accent); box-shadow: 0 0 0 2px rgba(215,169,35,.28) inset; background: color-mix(in srgb, var(--boq-accent) 12%, var(--boq-surface)); }
        .boq-quality strong { display: block; font-size: .95rem; margin-bottom: 6px; }
        .boq-quality span { display: block; color: var(--boq-muted); font-size: .74rem; line-height: 1.42; }
        .boq-items { display: grid; gap: 12px; padding: 18px; }
        .boq-item {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) 190px 150px;
          gap: 14px;
          align-items: center;
          border: 1px solid var(--boq-line);
          border-radius: 8px;
          padding: 14px;
          background: var(--boq-surface);
        }
        .boq-item.disabled { opacity: .56; }
        .boq-icon { width: 44px; height: 44px; border-radius: 8px; display: grid; place-items: center; background: var(--boq-soft); color: var(--boq-blue); border: 1px solid var(--boq-line); }
        .boq-item h3 { margin: 0 0 5px; font-size: .92rem; font-weight: 900; letter-spacing: 0; }
        .boq-meta { display: flex; flex-wrap: wrap; gap: 7px; color: var(--boq-muted); font-size: .72rem; font-weight: 800; }
        .boq-toggle {
          width: 38px;
          height: 22px;
          border: 0;
          border-radius: 999px;
          background: #b8beb8;
          padding: 3px;
          cursor: pointer;
        }
        .boq-toggle span { display: block; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .16s; }
        .boq-toggle.active { background: var(--boq-green); }
        .boq-toggle.active span { transform: translateX(16px); }
        .boq-toggle:disabled { cursor: not-allowed; }
        .boq-amount { text-align: right; }
        .boq-amount strong { display: block; font-size: .96rem; color: var(--boq-text); }
        .boq-amount span { display: block; color: var(--boq-muted); font-size: .72rem; margin-top: 3px; }
        .boq-summary { position: sticky; top: 18px; overflow: hidden; }
        .boq-total-band { background: #17211c; color: #fff; padding: 20px; }
        .boq-total-band span { display: block; color: rgba(255,255,255,.7); font-size: .75rem; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
        .boq-total-band strong { display: block; margin-top: 8px; font-size: 2.05rem; line-height: 1; }
        .boq-total-band small { display: block; margin-top: 8px; color: #f8dc7e; font-size: .82rem; font-weight: 900; }
        .boq-summary-body { padding: 18px; display: grid; gap: 12px; }
        .boq-line-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; color: var(--boq-muted); font-size: .82rem; }
        .boq-line-row strong { color: var(--boq-text); font-size: .88rem; }
        .boq-divider { height: 1px; background: var(--boq-line); margin: 4px 0; }
        .boq-stat-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .boq-stat { border: 1px solid var(--boq-line); background: var(--boq-soft); border-radius: 8px; padding: 12px; }
        .boq-stat span { display: block; color: var(--boq-muted); font-size: .68rem; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
        .boq-stat strong { display: block; margin-top: 6px; font-size: .95rem; }
        .boq-actions { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .boq-action {
          min-height: 42px;
          border: 1px solid var(--boq-line);
          border-radius: 7px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--boq-soft);
          color: var(--boq-text);
          text-decoration: none;
          font-size: .78rem;
          font-weight: 900;
          cursor: pointer;
        }
        .boq-action.primary { border-color: var(--boq-accent); background: var(--boq-accent); color: #16130a; }
        .boq-empty { padding: 28px; color: var(--boq-muted); text-align: center; }
        .boq-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0,0,0,.68);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 18px;
          overflow-y: auto;
        }
        .boq-modal {
          width: min(620px, 100%);
          background: var(--boq-surface);
          border: 1px solid var(--boq-line);
          box-shadow: 0 28px 90px rgba(0,0,0,.34);
          margin: 20px 0;
        }
        .boq-modal-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          padding: 18px;
          border-bottom: 1px solid var(--boq-line);
        }
        .boq-modal-head h2 { margin: 4px 0 0; font-size: 1.2rem; }
        .boq-modal-kicker { display: flex; align-items: center; gap: 7px; color: var(--boq-accent); text-transform: uppercase; letter-spacing: .08em; font-size: .7rem; font-weight: 900; }
        .boq-modal-close { border: 1px solid var(--boq-line); background: var(--boq-soft); color: var(--boq-text); width: 36px; height: 36px; border-radius: 7px; display: grid; place-items: center; cursor: pointer; }
        .boq-quote-form { padding: 18px; display: grid; gap: 13px; }
        .boq-quote-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
        .boq-quote-field label { display: block; margin-bottom: 7px; color: var(--boq-muted); font-size: .68rem; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
        .boq-quote-field input,
        .boq-quote-field textarea {
          width: 100%;
          border: 1px solid var(--boq-line);
          border-radius: 7px;
          background: var(--boq-soft);
          color: var(--boq-text);
          padding: 12px;
          font: inherit;
          font-weight: 800;
          outline: none;
        }
        .boq-quote-field textarea { min-height: 86px; resize: vertical; }
        .boq-quote-msg { border: 1px solid var(--boq-line); background: var(--boq-soft); color: var(--boq-muted); padding: 11px 12px; border-radius: 7px; font-size: .78rem; font-weight: 800; line-height: 1.45; }
        .boq-report-note { padding: 14px; border: 1px solid rgba(215,169,35,.5); background: color-mix(in srgb, var(--boq-accent) 14%, var(--boq-surface)); color: var(--boq-text); border-radius: 8px; line-height: 1.55; font-size: .82rem; }
        @media print {
          .boq-hero, .boq-config, .boq-actions, .boq-quality-grid { display: none; }
          .boq-shell { margin: 0; padding: 0; width: 100%; }
          .boq-layout { display: block; }
          .boq-summary { position: static; margin-top: 18px; }
        }
        @media (max-width: 1080px) {
          .boq-config { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .boq-layout { grid-template-columns: 1fr; }
          .boq-summary { position: static; }
        }
        @media (max-width: 820px) {
          .boq-hero { min-height: 230px; padding-bottom: 58px; }
          .boq-config { grid-template-columns: 1fr; }
          .boq-quality-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .boq-item { grid-template-columns: 40px minmax(0, 1fr); }
          .boq-item .boq-select-wrap, .boq-amount { grid-column: 2; text-align: left; }
          .boq-quote-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .boq-shell { padding: 0 14px 44px; }
          .boq-quality-grid { grid-template-columns: 1fr; }
          .boq-stat-grid, .boq-actions { grid-template-columns: 1fr; }
          .boq-hero h1 { font-size: 2.1rem; }
        }
      `}</style>

      <main className={`boq-page${isDark ? ' dark' : ''}`}>
        <section className="boq-hero">
          <div className="boq-hero-inner">
            <div className="boq-kicker">
              <Building2 size={16} /> Real Estate BOQ Calculator
            </div>
            <h1>Construction Budget Calculator</h1>
            <p>
              Select location, property size, floors and brands. Materials, labour, transport and
              finishing cost update instantly as a live house-construction estimate.
            </p>
          </div>
        </section>

        <div className="boq-shell">
          <section className="boq-config" aria-label="Project configuration">
            <div className="boq-field">
              <label className="boq-label">
                <MapPin size={14} /> Location
              </label>
              <div className="boq-select-wrap">
                <select className="boq-select" value={project.city} onChange={(e) => updateProject('city', e.target.value)}>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <ChevronDown className="boq-select-icon" size={16} />
              </div>
            </div>
            <div className="boq-field">
              <label className="boq-label">
                <Ruler size={14} /> Property Size
              </label>
              <div className="boq-size-wrap">
                <input
                  className="boq-input"
                  type="number"
                  min="100"
                  step="50"
                  value={project.area}
                  onChange={(e) => updateProject('area', e.target.value)}
                />
                <span className="boq-size-unit">sqft</span>
              </div>
            </div>
            <div className="boq-field">
              <label className="boq-label">
                <Layers size={14} /> Floors
              </label>
              <div className="boq-select-wrap">
                <select className="boq-select" value={project.floors} onChange={(e) => updateProject('floors', Number(e.target.value))}>
                  {FLOOR_OPTIONS.map((floor) => (
                    <option key={floor.value} value={floor.value}>
                      {floor.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="boq-select-icon" size={16} />
              </div>
            </div>
            <div className="boq-field">
              <label className="boq-label">
                <Home size={14} /> Foundation
              </label>
              <div className="boq-select-wrap">
                <select className="boq-select" value={project.foundation} onChange={(e) => updateProject('foundation', e.target.value)}>
                  {Object.entries(FOUNDATION_TYPES).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="boq-select-icon" size={16} />
              </div>
            </div>
            <div className="boq-field">
              <label className="boq-label">
                <Settings2 size={14} /> Built-up Area
              </label>
              <div className="boq-input" style={{ display: 'flex', alignItems: 'center' }}>
                {formatNumber(estimate.builtUpArea)} sqft
              </div>
            </div>
          </section>

          <div className="boq-layout">
            <div>
              <section className="boq-panel">
                <div className="boq-panel-head">
                  <div>
                    <h2 className="boq-panel-title">Quality Package</h2>
                    <p className="boq-panel-sub">Package selection changes material grade, finishing and labour intensity.</p>
                  </div>
                  <span className="boq-chip">
                    <Check size={14} /> {project.quality}
                  </span>
                </div>
                <div className="boq-quality-grid">
                  {Object.entries(settings.qualityLevels).map(([key, item]) => (
                    <button
                      key={key}
                      className={`boq-quality${project.quality === key ? ' active' : ''}`}
                      type="button"
                      onClick={() => updateProject('quality', key)}
                    >
                      <strong>{item.label}</strong>
                      <span>{item.note}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="boq-panel" style={{ marginTop: 22 }}>
                <div className="boq-panel-head">
                  <div>
                    <h2 className="boq-panel-title">Material BOQ</h2>
                    <p className="boq-panel-sub">
                      Mandatory items stay included. Recommended items can be toggled and brand-switched.
                    </p>
                  </div>
                  <span className="boq-chip">
                    <PackageCheck size={14} /> {estimate.lineItems.length} active items
                  </span>
                </div>

                {loading ? (
                  <div className="boq-empty">Loading calculator rates...</div>
                ) : (
                  <div className="boq-items">
                    {CATEGORY_SPECS.map((spec) => {
                      const options = productsByCategory.get(spec.key) || [];
                      const item = estimate.lineItems.find((line) => line.spec.key === spec.key);
                      const isIncluded = included[spec.key];

                      return (
                        <article className={`boq-item${!isIncluded ? ' disabled' : ''}`} key={spec.key}>
                          <div className="boq-icon">
                            {spec.phase === 'Structure' ? <Building2 size={20} /> : spec.phase === 'Masonry' ? <Hammer size={20} /> : <PackageCheck size={20} />}
                          </div>
                          <div>
                            <h3>{spec.title}</h3>
                            <div className="boq-meta">
                              <span>{spec.type}</span>
                              <span>{spec.phase}</span>
                              {item && <span>{formatNumber(item.quantity)} {item.product?.unit || spec.unit}</span>}
                            </div>
                          </div>
                          <div className="boq-select-wrap">
                            {spec.type === 'Mandatory' ? null : (
                              <button
                                className={`boq-toggle${isIncluded ? ' active' : ''}`}
                                type="button"
                                onClick={() => toggleIncluded(spec)}
                                aria-label={`Toggle ${spec.title}`}
                              >
                                <span />
                              </button>
                            )}
                            <select
                              className="boq-select"
                              value={selectedProducts[spec.key] || options[0]?.id || ''}
                              onChange={(e) => selectProduct(spec.key, e.target.value)}
                              disabled={!isIncluded}
                              style={{ marginTop: spec.type === 'Mandatory' ? 0 : 8 }}
                            >
                              {options.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="boq-select-icon" size={16} style={{ top: spec.type === 'Mandatory' ? '50%' : '68%' }} />
                          </div>
                          <div className="boq-amount">
                            <strong>{item ? formatCurrency(item.amount) : formatCurrency(0)}</strong>
                            <span>{item ? `${formatCurrency(item.price)} / ${item.product?.unit || spec.unit}` : 'Not included'}</span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <aside className="boq-panel boq-summary">
              <div className="boq-total-band">
                <span>Total Estimate</span>
                <strong>{formatCurrency(estimate.grandTotal)}</strong>
                <small>{formatCurrency(estimate.perSqft)} per sqft</small>
              </div>
              <div className="boq-summary-body">
                <div className="boq-stat-grid">
                  <div className="boq-stat">
                    <span>Location</span>
                    <strong>{project.city}</strong>
                  </div>
                  <div className="boq-stat">
                    <span>Built-up</span>
                    <strong>{formatNumber(estimate.builtUpArea)} sqft</strong>
                  </div>
                  <div className="boq-stat">
                    <span>Floors</span>
                    <strong>{estimate.floors}</strong>
                  </div>
                  <div className="boq-stat">
                    <span>Package</span>
                    <strong>{project.quality}</strong>
                  </div>
                </div>

                <div className="boq-divider" />
                {['Structure', 'Masonry', 'Services', 'Finishing'].map((phase) => (
                  <div className="boq-line-row" key={phase}>
                    <span>{phase}</span>
                    <strong>{formatCurrency(phaseTotals[phase] || 0)}</strong>
                  </div>
                ))}
                <div className="boq-divider" />
                <div className="boq-line-row">
                  <span>Material total</span>
                  <strong>{formatCurrency(estimate.materialTotal)}</strong>
                </div>
                <div className="boq-line-row">
                  <span>Labour cost</span>
                  <strong>{formatCurrency(estimate.labourTotal)}</strong>
                </div>
                <div className="boq-line-row">
                  <span>Transport</span>
                  <strong>{formatCurrency(estimate.transportTotal)}</strong>
                </div>
                <div className="boq-line-row">
                  <span>Supervision</span>
                  <strong>{formatCurrency(estimate.supervisionTotal)}</strong>
                </div>
                <div className="boq-line-row">
                  <span>Contingency</span>
                  <strong>{formatCurrency(estimate.contingencyTotal)}</strong>
                </div>
                <div className="boq-divider" />
                <div className="boq-line-row">
                  <span>Labour base rate</span>
                  <strong>{formatCurrency(estimate.cityRate.labour)} / sqft</strong>
                </div>
                <div className="boq-line-row">
                  <span>Foundation</span>
                  <strong>{estimate.foundation.label}</strong>
                </div>

                <div className="boq-actions">
                  <button className="boq-action primary" type="button" onClick={openQuoteModal}>
                    <PhoneCall size={16} /> Get Quote
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      {quoteOpen && (
        <div className="boq-modal-overlay">
          <div className="boq-modal">
            <div className="boq-modal-head">
              <div>
                <div className="boq-modal-kicker">
                  <ShieldCheck size={15} /> Verified Estimate Download
                </div>
                <h2>{quoteStep === 'verified' ? 'Your report is ready' : quoteStep === 'otp' ? 'Verify OTP' : 'Request your estimate report'}</h2>
              </div>
              <button className="boq-modal-close" type="button" onClick={() => setQuoteOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {quoteStep === 'details' && (
              <form className="boq-quote-form" onSubmit={requestQuoteOtp}>
                <div className="boq-report-note">
                  Fill your contact details to receive an OTP. After verification, you can download a professional MTBoss budget estimate report with logo, BOQ, summary and disclaimer.
                </div>
                <div className="boq-quote-grid">
                  <div className="boq-quote-field">
                    <label>Full Name *</label>
                    <input value={quoteForm.name} onChange={(e) => updateQuoteForm('name', e.target.value)} required placeholder="Your name" />
                  </div>
                  <div className="boq-quote-field">
                    <label>Mobile Number *</label>
                    <input value={quoteForm.phone} onChange={(e) => updateQuoteForm('phone', e.target.value)} required placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="boq-quote-field">
                  <label>Email Address *</label>
                  <input type="email" value={quoteForm.email} onChange={(e) => updateQuoteForm('email', e.target.value)} required placeholder="you@example.com" />
                </div>
                <div className="boq-quote-field">
                  <label>Site Address *</label>
                  <textarea value={quoteForm.address} onChange={(e) => updateQuoteForm('address', e.target.value)} required placeholder="Plot/street, city, state and PIN" />
                </div>
                <div className="boq-quote-field">
                  <label>Site Image *</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    onChange={(e) => setSiteImage(e.target.files?.[0] || null)}
                  />
                  <div className="boq-quote-msg" style={{ marginTop: 8 }}>
                    Upload a clear current site/plot photo. JPG, PNG or WEBP, max 5MB.
                  </div>
                </div>
                {quoteMsg && <div className="boq-quote-msg">{quoteMsg}</div>}
                <button className="boq-action primary" type="submit" disabled={quoteLoading}>
                  <Mail size={16} /> {quoteLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            )}

            {quoteStep === 'otp' && (
              <form className="boq-quote-form" onSubmit={verifyQuoteOtp}>
                <div className="boq-report-note">
                  Enter the OTP sent to your email. The same OTP verifies your quote request and unlocks the report download.
                </div>
                <div className="boq-quote-field">
                  <label>6 Digit OTP *</label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    inputMode="numeric"
                    placeholder="Enter OTP"
                  />
                </div>
                {devOtp && (
                  <div className="boq-quote-msg">
                    Dev OTP: <strong>{devOtp}</strong>
                  </div>
                )}
                {quoteMsg && <div className="boq-quote-msg">{quoteMsg}</div>}
                <button className="boq-action primary" type="submit" disabled={quoteLoading || otp.length !== 6}>
                  <ShieldCheck size={16} /> {quoteLoading ? 'Verifying...' : 'Verify & Unlock Download'}
                </button>
                <button className="boq-action" type="button" onClick={requestQuoteOtp} disabled={quoteLoading}>
                  Resend OTP
                </button>
              </form>
            )}

            {quoteStep === 'verified' && (
              <div className="boq-quote-form">
                <div className="boq-report-note">
                  Verification complete. Your report includes a detailed BOQ, total estimate, selected brands, MTBoss contact details and an approximation disclaimer for site-visit validation.
                </div>
                {quoteMsg && <div className="boq-quote-msg">{quoteMsg}</div>}
                <button className="boq-action primary" type="button" onClick={downloadVerifiedReport}>
                  <PhoneCall size={16} /> Download Estimate Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
