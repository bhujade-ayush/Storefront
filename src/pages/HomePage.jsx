import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon.jsx';
import ProductImage from '../components/ui/ProductImage.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { btn, container, h2, input } from '../components/ui/styles.js';
import { products, CATEGORIES } from '../data/products.js';
import { cx } from '../lib/format.js';

const PERKS = [
  { icon: 'truck', title: 'Free delivery', text: 'On orders over ₹999' },
  { icon: 'returns', title: '30-day returns', text: 'No questions asked' },
  { icon: 'lock', title: 'Secure payment', text: 'UPI, cards, net banking' },
  { icon: 'chat', title: 'Help when you need it', text: 'Chat, 9am – 9pm' },
];

const CATEGORY_TINTS = { Clothing: '#E6E1D8', Footwear: '#DCE3EE', Accessories: '#EADBD2', Home: '#DDE5DC' };
const FILTERS = ['All', ...CATEGORIES];
const SORTS = {
  featured: { label: 'Featured', fn: () => 0 },
  newest: { label: 'Newest', fn: (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) },
  low: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  high: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
};
const PAGE_SIZE = 8;

export default function HomePage() {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('featured');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const popular = products.filter((p) => p.popular);
  const list = popular
    .filter((p) => filter === 'All' || p.category === filter)
    .slice()
    .sort(SORTS[sort].fn);

  return (
    <main>
      {/* Hero */}
      <section className="bg-surface">
        <div className={`${container} flex flex-wrap items-center gap-12 py-14`}>
          <div className="flex flex-[1_1_420px] flex-col items-start gap-5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand">New season</span>
            <h1 className="m-0 font-display text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-tight">
              Everyday essentials, made to last.
            </h1>
            <p className="m-0 max-w-[460px] text-lg leading-relaxed text-muted">
              Simple, well-made clothing and accessories for every day. Fresh arrivals every week.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#products" className={btn.primary}>
                Shop new arrivals
              </a>
              <Link to="/search?sale=1" className={btn.secondary}>
                Browse the sale
              </Link>
            </div>
          </div>
          <ProductImage
            tint="#DCE3EE"
            iconSize={40}
            caption="Hero image · 1200 × 800"
            className="h-[400px] flex-[1_1_420px] rounded-2xl"
          />
        </div>
      </section>

      {/* Perks */}
      <section aria-label="Why shop with us" className="border-b border-line">
        <div className={`${container} grid gap-5 py-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]`}>
          {PERKS.map((p) => (
            <div key={p.title} className="flex items-center gap-3.5">
              <Icon name={p.icon} size={26} strokeWidth={1.6} className="text-brand" />
              <div>
                <div className="text-[15px] font-semibold">{p.title}</div>
                <div className="text-[13px] text-muted">{p.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className={`${container} pb-6 pt-16`}>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className={cx(h2, 'm-0')}>Shop by category</h2>
          <Link to="/search?q=" className="text-[15px] font-semibold no-underline">
            View all
          </Link>
        </div>
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(240px,100%),1fr))]">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/search?q=${c.toLowerCase()}`}
              className="group flex flex-col gap-3 text-ink no-underline hover:text-ink"
            >
              <ProductImage tint={CATEGORY_TINTS[c]} iconSize={32} className="h-[220px] rounded-[14px]" />
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-semibold group-hover:underline">{c}</span>
                <span className="text-[13px] text-muted">{products.filter((p) => p.category === c).length} items</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className={`${container} scroll-mt-6 pb-[72px] pt-12`}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className={cx(h2, 'm-0')}>Popular right now</h2>
          <div className="flex items-center gap-2.5">
            <label htmlFor="home-sort" className="text-sm text-muted">
              Sort by
            </label>
            <select
              id="home-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 rounded-[10px] border border-line bg-white px-3 text-sm"
            >
              {Object.entries(SORTS).map(([k, s]) => (
                <option key={k} value={k}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div role="group" aria-label="Filter by category" className="mb-7 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFilter(f);
                  setVisible(PAGE_SIZE);
                }}
                className={cx(
                  'h-10 rounded-full border px-[18px] text-sm',
                  active ? 'border-ink bg-ink font-semibold text-white' : 'border-line bg-white font-medium text-ink hover:border-ink',
                )}
              >
                {f}
              </button>
            );
          })}
        </div>

        <p className="mb-4 mt-0 text-sm text-muted" aria-live="polite">
          Showing {Math.min(visible, list.length)} of {list.length} products
        </p>
        <ProductGrid products={list.slice(0, visible)} />

        {visible < list.length && (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className={btn.quiet}>
              Load more products
            </button>
          </div>
        )}
      </section>

      <Newsletter />
    </main>
  );
}

function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="bg-surface">
      <div className={`${container} flex flex-wrap items-center justify-between gap-6 py-14`}>
        <div className="flex-[1_1_360px]">
          <h2 className="m-0 mb-2 font-display text-[28px] font-bold tracking-tight">Get 10% off your first order</h2>
          <p className="m-0 text-base text-muted">Join our newsletter for new arrivals and members-only offers.</p>
        </div>
        {done ? (
          <p role="status" className="m-0 flex-[1_1_380px] text-base font-semibold text-success">
            Thanks! Check your inbox for your code.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true); // send to your newsletter service here
            }}
            className="flex flex-[1_1_380px] flex-wrap gap-2.5"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input id="newsletter-email" type="email" required placeholder="you@example.com" className={cx(input, 'flex-[1_1_220px]')} />
            <button type="submit" className={btn.primary}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
