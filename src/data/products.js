// Sample catalogue. Replace with data from your backend / API.
// `tint` is the placeholder image colour until real photos are added.

export const CATEGORIES = ['Clothing', 'Footwear', 'Accessories', 'Home'];

export const products = [
  { id: 'relaxed-linen-shirt', name: 'Relaxed linen shirt', category: 'Clothing', price: 1899, was: 2499, tint: '#E6E1D8', popular: true },
  { id: 'classic-cotton-crew-tee', name: 'Classic cotton crew tee', category: 'Clothing', price: 799, isNew: true, tint: '#E6E1D8', popular: true },
  { id: 'everyday-canvas-sneakers', name: 'Everyday canvas sneakers', category: 'Footwear', price: 2499, tint: '#DCE3EE', popular: true },
  { id: 'leather-card-wallet', name: 'Leather card wallet', category: 'Accessories', price: 1199, tint: '#EADBD2', popular: true },
  { id: 'straight-fit-chinos', name: 'Straight-fit chinos', category: 'Clothing', price: 1999, tint: '#E3E0EC', popular: true },
  { id: 'trail-running-shoes', name: 'Trail running shoes', category: 'Footwear', price: 3499, was: 4299, tint: '#E6E1D8', popular: true },
  { id: 'ceramic-coffee-mug-set', name: 'Ceramic coffee mug, set of 2', category: 'Home', price: 649, isNew: true, tint: '#DDE5DC', popular: true },
  { id: 'canvas-tote-bag', name: 'Canvas tote bag', category: 'Accessories', price: 899, tint: '#DCE3EE', popular: true },
  { id: 'linen-blend-trousers', name: 'Linen blend trousers', category: 'Clothing', price: 2299, tint: '#DDE5DC' },
  { id: 'linen-camp-collar-shirt', name: 'Linen camp-collar shirt', category: 'Clothing', price: 1699, isNew: true, tint: '#DCE3EE' },
  { id: 'linen-drawstring-shorts', name: 'Linen drawstring shorts', category: 'Clothing', price: 1299, tint: '#E3E0EC' },
  { id: 'linen-bedsheet-set', name: 'Linen bedsheet set, queen', category: 'Home', price: 3499, was: 3999, tint: '#EADBD2' },
  { id: 'linen-table-napkins', name: 'Linen table napkins, set of 4', category: 'Home', price: 799, tint: '#DDE5DC' },
  { id: 'linen-cushion-cover', name: 'Linen cushion cover', category: 'Home', price: 599, isNew: true, tint: '#E6E1D8' },
  { id: 'linen-bucket-hat', name: 'Linen bucket hat', category: 'Accessories', price: 699, tint: '#DCE3EE' },
  { id: 'linen-cotton-tote', name: 'Linen-cotton tote bag', category: 'Accessories', price: 999, tint: '#EADBD2' },
];

// Shared options used on the product page (per-product in a real catalogue).
export const COLOURS = [
  { name: 'Sand', hex: '#D8C8AE', tints: ['#E6E1D8', '#DFD8CB', '#EDE9E2', '#D9D1C2'] },
  { name: 'Sage', hex: '#9DAE97', tints: ['#DDE5DC', '#D2DCD0', '#E6ECE5', '#C9D5C6'] },
  { name: 'Navy', hex: '#2B3A55', tints: ['#DCE3EE', '#D0D9E8', '#E6EBF3', '#C6D1E3'] },
  { name: 'White', hex: '#F4F3EF', tints: ['#F1F0EC', '#E9E8E3', '#F6F5F2', '#E2E1DB'] },
];

export const SIZES = [
  { label: 'XS', soldOut: true },
  { label: 'S' },
  { label: 'M' },
  { label: 'L' },
  { label: 'XL' },
];

export const FREE_DELIVERY_THRESHOLD = 999;
export const STANDARD_DELIVERY_FEE = 79;

export function getProduct(id) {
  return products.find((p) => p.id === id);
}

export function discountPercent(product) {
  return product.was ? Math.round((1 - product.price / product.was) * 100) : 0;
}

/** Simple keyword search: every word must appear in the name or category. */
export function searchProducts(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return products;
  return products.filter((p) => {
    const haystack = `${p.name} ${p.category}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

export const SEARCH_TERMS = [
  'linen', 'linen shirt', 'linen trousers', 'linen bedsheet', 'shirt', 'shorts',
  'sneakers', 'running shoes', 'tote bag', 'coffee mug', 'card wallet', 'chinos',
];
export const POPULAR_SEARCHES = ['linen', 'tote bag', 'running shoes', 'coffee mug'];
