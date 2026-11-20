import { Link } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import ProductImage from '../ui/ProductImage.jsx';
import Price from '../ui/Price.jsx';
import { btn } from '../ui/styles.js';
import { discountPercent } from '../../data/products.js';
import { useCart } from '../../context/CartContext.jsx';

export default function ProductCard({ product, showAddToCart = true }) {
  const { addItem } = useCart();
  const off = discountPercent(product);
  const href = `/product/${product.id}`;

  return (
    <article className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[14px]">
        <Link to={href} tabIndex={-1} aria-hidden="true">
          <ProductImage src={product.image} tint={product.tint} className="h-full w-full" />
        </Link>
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-sale px-2.5 py-1 text-xs font-bold text-white">−{off}%</span>
        )}
        {!off && product.isNew && (
          <span className="absolute left-3 top-3 rounded-md bg-ink px-2.5 py-1 text-xs font-bold text-white">New</span>
        )}
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink hover:bg-surface"
        >
          <Icon name="heart" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[13px] text-muted">{product.category}</span>
        <Link to={href} className="text-base font-semibold leading-snug text-ink no-underline hover:text-brand">
          {product.name}
        </Link>
        <Price price={product.price} was={product.was} />
      </div>

      {showAddToCart && (
        <button type="button" onClick={() => addItem(product.id)} className={btn.small}>
          Add to cart
        </button>
      )}
    </article>
  );
}
