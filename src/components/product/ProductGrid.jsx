import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, minWidth = 240, showAddToCart = true }) {
  return (
    <div
      className="grid gap-x-5 gap-y-7"
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}px, 100%), 1fr))` }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} showAddToCart={showAddToCart} />
      ))}
    </div>
  );
}
