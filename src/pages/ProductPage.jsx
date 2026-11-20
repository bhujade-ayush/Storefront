import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/ui/Icon.jsx';
import ProductImage from '../components/ui/ProductImage.jsx';
import Price from '../components/ui/Price.jsx';
import QuantityStepper from '../components/ui/QuantityStepper.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { btn, container, input } from '../components/ui/styles.js';
import { getProduct, products, discountPercent, COLOURS, SIZES } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { cx } from '../lib/format.js';
import NotFoundPage from './NotFoundPage.jsx';

const DETAILS = [
  { title: 'Product details', open: true, body: <ul className="m-0 mb-5 pl-5 text-[15px] leading-[1.8] text-body"><li>100% linen</li><li>Relaxed fit, regular length</li><li>Button-down front, single chest pocket</li></ul> },
  { title: 'Materials & care', body: <p className="m-0 mb-5 text-[15px] leading-relaxed text-body">Machine wash cold with similar colours. Line dry. Warm iron if needed.</p> },
  { title: 'Shipping & returns', body: <p className="m-0 mb-5 text-[15px] leading-relaxed text-body">Free delivery on orders over ₹999. Return or exchange within 30 days of delivery.</p> },
];

export default function ProductPage() {
  const { id } = useParams();
  const product = getProduct(id);
  // `key` resets all selections when moving to another product
  return product ? <ProductDetail key={product.id} product={product} /> : <NotFoundPage />;
}

function ProductDetail({ product }) {
  const { addItem } = useCart();
  const [photo, setPhoto] = useState(0);
  const [colour, setColour] = useState(0);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const tints = COLOURS[colour].tints;
  const off = discountPercent(product);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  function addToCart() {
    addItem(product.id, { variant: `${COLOURS[colour].name} · ${size}`, qty });
    setAdded(true);
  }

  return (
    <main className={`${container} pb-[72px] pt-6`}>
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link to="/" className="text-muted no-underline hover:underline">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/search?q=${product.category.toLowerCase()}`} className="text-muted no-underline hover:underline">{product.category}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="flex flex-wrap items-start gap-12">
        {/* Gallery */}
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-3">
          <ProductImage tint={tints[photo]} iconSize={44} caption={`Product photo ${photo + 1} of 4`} className="aspect-square rounded-2xl" />
          <div role="group" aria-label="Product photos" className="grid grid-cols-4 gap-3">
            {tints.map((t, i) => (
              <button
                key={t}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={photo === i}
                onClick={() => setPhoto(i)}
                className={cx('aspect-square rounded-[10px] border-2', photo === i ? 'border-ink' : 'border-transparent hover:border-line-strong')}
                style={{ backgroundColor: t }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <span className="text-sm text-muted">{product.category}</span>
            <h1 className="m-0 font-display text-4xl font-bold leading-tight tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm">
              <span aria-hidden="true" className="text-base tracking-[2px] text-[#B45309]">★★★★★</span>
              <span className="font-semibold"><span className="sr-only">Rated </span>4.6<span className="sr-only"> out of 5</span></span>
              <a href="#reviews" className="text-muted">128 reviews</a>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <Price price={product.price} was={product.was} size="lg" />
              {off > 0 && <span className="rounded-md bg-[#FDECEA] px-2.5 py-1 text-[13px] font-bold text-sale">{off}% off</span>}
            </div>
            <span className="text-[13px] text-muted">Inclusive of all taxes</span>
          </div>

          <p className="m-0 text-base leading-relaxed text-body">
            A breathable, easy-fitting piece made to get better with every wash.
          </p>

          {/* Colour */}
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-3 p-0 text-[15px] font-semibold">
              Colour: <span className="font-normal text-muted">{COLOURS[colour].name}</span>
            </legend>
            <div className="flex gap-3">
              {COLOURS.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  aria-pressed={colour === i}
                  onClick={() => {
                    setColour(i);
                    setPhoto(0);
                  }}
                  className={cx('h-11 w-11 rounded-full bg-white p-[3px]', colour === i ? 'border-2 border-ink' : 'border border-line hover:border-line-strong')}
                >
                  <span className="block h-full w-full rounded-full" style={{ backgroundColor: c.hex }} />
                </button>
              ))}
            </div>
          </fieldset>

          {/* Size */}
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-3 flex w-full justify-between p-0 text-[15px] font-semibold">
              <span>Size: <span className="font-normal text-muted">{size}</span></span>
              <a href="#" className="text-sm font-medium">Size guide</a>
            </legend>
            <div className="grid grid-cols-5 gap-2">
              {SIZES.map((s) =>
                s.soldOut ? (
                  <button
                    key={s.label}
                    type="button"
                    disabled
                    aria-label={`${s.label}, sold out`}
                    className="h-12 cursor-not-allowed rounded-[10px] border border-dashed border-line-strong bg-surface text-[15px] text-[#6B7079] line-through"
                  >
                    {s.label}
                  </button>
                ) : (
                  <button
                    key={s.label}
                    type="button"
                    aria-pressed={size === s.label}
                    onClick={() => setSize(s.label)}
                    className={cx(
                      'h-12 rounded-[10px] border text-[15px]',
                      size === s.label ? 'border-ink bg-ink font-semibold text-white' : 'border-line-strong bg-white font-medium text-ink hover:border-ink',
                    )}
                  >
                    {s.label}
                  </button>
                ),
              )}
            </div>
          </fieldset>

          {/* Quantity + add */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <QuantityStepper value={qty} onChange={setQty} size="lg" />
              <button type="button" onClick={addToCart} className={cx(btn.primary, 'h-[52px] flex-[1_1_200px] text-base')}>
                {added ? 'Added to cart ✓' : 'Add to cart'}
              </button>
              <button type="button" aria-label="Add to wishlist" className="flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border border-line-strong bg-white text-ink hover:border-ink">
                <Icon name="heart" size={22} />
              </button>
            </div>
            {added && (
              <Link to="/cart" className="text-sm font-semibold">
                View cart →
              </Link>
            )}
          </div>

          <DeliveryCheck />

          {/* Accordions */}
          <div className="border-t border-line">
            {DETAILS.map((d) => (
              <details key={d.title} open={d.open} className="group border-b border-line">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-base font-semibold [&::-webkit-details-marker]:hidden">
                  {d.title}
                  <Icon name="chevronDown" className="transition-transform group-open:rotate-180" />
                </summary>
                {d.body}
              </details>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="m-0 mb-6 font-display text-[28px] font-bold tracking-tight">You may also like</h2>
          <ProductGrid products={related} showAddToCart={false} />
        </section>
      )}
    </main>
  );
}

function DeliveryCheck() {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState(null);
  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-line p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Replace with a real serviceability API call.
          setResult(/^\d{6}$/.test(pin) ? 'ok' : 'invalid');
        }}
        className="flex flex-col gap-3.5"
      >
        <label htmlFor="pin" className="text-[15px] font-semibold">Check delivery</label>
        <div className="flex gap-2">
          <input
            id="pin"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter PIN code"
            className={cx(input, 'h-11 flex-1')}
          />
          <button type="submit" className={btn.small}>Check</button>
        </div>
        {result === 'ok' && <p role="status" className="m-0 text-sm font-medium text-success">Delivers to {pin} in 3–5 days.</p>}
        {result === 'invalid' && <p role="alert" className="m-0 text-sm text-sale">Enter a 6-digit PIN code.</p>}
      </form>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm text-body">
        <li className="flex items-center gap-2.5"><Icon name="truck" strokeWidth={1.6} className="text-brand" />Free delivery in 3–5 days</li>
        <li className="flex items-center gap-2.5"><Icon name="returns" strokeWidth={1.6} className="text-brand" />30-day free returns</li>
        <li className="flex items-center gap-2.5"><Icon name="lock" strokeWidth={1.6} className="text-brand" />Cash on delivery available</li>
      </ul>
    </div>
  );
}
