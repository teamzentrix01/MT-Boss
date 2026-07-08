export const fallbackHeroBanners = [
  {
    id: 'fallback-hero-1',
    label: 'Engineering Excellence',
    title: 'Sustainable Technology Led',
    subtitle: 'Engineering, Procurement & Construction',
    description: 'We provide simple and innovative solutions to deliver complex projects on time.',
    image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80',
    sort_order: 0,
    is_active: true,
  },
  {
    id: 'fallback-hero-2',
    label: 'Engineering Excellence',
    title: "Building Tomorrow's",
    subtitle: 'Infrastructure Today',
    description: 'Delivering world-class infrastructure across energy, transport, and urban development.',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',
    sort_order: 1,
    is_active: true,
  },
];

export const fallbackQuickServices = [
  {
    id: 'fallback-quick-1',
    icon: 'wrench',
    label: 'Plumbing',
    description: 'Leak repair, fixture installation, and quick home plumbing support.',
    base_price: 150,
    visiting_price: 150,
    duration: '15 mins',
    slug: 'plumbing',
    main_category: 'Home Services',
    sub_category: 'Leak Repair, Taps, Pipes',
  },
  {
    id: 'fallback-quick-2',
    icon: 'zap',
    label: 'Electrical',
    description: 'Switches, wiring checks, fittings, and minor electrical repairs.',
    base_price: 150,
    visiting_price: 150,
    duration: '15 mins',
    slug: 'electrical',
    main_category: 'Home Services',
    sub_category: 'Wiring, Switches, Fixtures',
  },
  {
    id: 'fallback-quick-3',
    icon: 'paintbrush',
    label: 'Painting',
    description: 'Wall touch-ups, repainting inspection, and painting estimates.',
    base_price: 150,
    visiting_price: 150,
    duration: '15 mins',
    slug: 'painting',
    main_category: 'Home Services',
    sub_category: 'Interior, Exterior, Touch-up',
  },
];

export const fallbackPrimaryServices = [
  {
    id: 'fallback-primary-1',
    slug: 'commercial-buildings',
    title: 'Commercial Buildings',
    description: 'From corporate offices to retail complexes, we design and construct commercial spaces built to last.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  },
  {
    id: 'fallback-primary-2',
    slug: 'hotel-hospitality',
    title: 'Hotel & Hospitality',
    description: 'Premium hotel and resort construction with careful attention to interiors and guest experience.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  },
  {
    id: 'fallback-primary-3',
    slug: 'residential-projects',
    title: 'Residential Projects',
    description: 'Affordable housing to luxury villas, built around comfort, safety, and reliable delivery.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  },
];

export const fallbackProjects = [
  {
    id: 'fallback-project-1',
    title: 'Urban Commercial Complex',
    category: 'Commercial',
    location: 'India',
    description: 'A modern commercial development focused on efficient space planning and durable construction.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
    size: 'large',
    status: 'published',
  },
  {
    id: 'fallback-project-2',
    title: 'Residential Township',
    category: 'Residential',
    location: 'India',
    description: 'Integrated residential planning with strong infrastructure and livable open spaces.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
    size: 'medium',
    status: 'published',
  },
  {
    id: 'fallback-project-3',
    title: 'Industrial Facility',
    category: 'Industrial',
    location: 'India',
    description: 'Functional industrial construction designed for safety, scale, and day-to-day operations.',
    image_url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=900&q=80',
    size: 'medium',
    status: 'published',
  },
];

export const fallbackShopCategories = [
  {
    id: 'fallback-shop-1',
    name: 'Cement',
    emoji: 'C',
    types: ['OPC 43 Grade', 'PPC', 'White Cement'],
    is_active: true,
    sort_order: 0,
  },
  {
    id: 'fallback-shop-2',
    name: 'Steel',
    emoji: 'S',
    types: ['TMT Bars', 'Carbon Steel', 'Stainless Steel'],
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'fallback-shop-3',
    name: 'Sand & Gravel',
    emoji: 'G',
    types: ['River Sand', 'M-Sand', 'Coarse Gravel'],
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'fallback-shop-4',
    name: 'Bricks',
    emoji: 'B',
    types: ['Red Bricks', 'Fly Ash', 'AAC Blocks'],
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'fallback-shop-5',
    name: 'Paint',
    emoji: 'P',
    types: ['Interior', 'Exterior', 'Waterproof'],
    is_active: true,
    sort_order: 4,
  },
  {
    id: 'fallback-shop-6',
    name: 'Tiles',
    emoji: 'T',
    types: ['Floor Tiles', 'Wall Tiles', 'Vitrified'],
    is_active: true,
    sort_order: 5,
  },
];

export function fallbackResponse(data) {
  return {
    success: true,
    data,
    fallback: true,
    warning: 'Database connection unavailable; serving fallback content.',
  };
}
