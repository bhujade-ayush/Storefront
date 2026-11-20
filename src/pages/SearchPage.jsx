import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/ui/Icon.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { btn, container } from '../components/ui/styles.js';
import { products, searchProducts, CATEGORIES, POPULAR_SEARCHES, SEARCH_TERMS } from '../data/products.js';
import { cx } from '../lib/format.js';

const PRICE_RANGES = [
  { id: 'any', label: 'Any price', test: () => true },
  { id: 'u1', label: 'Under ₹1,000', test: (n) => n < 1000 },
  { id: 'u2', label: '₹1,000 – ₹2,000', test: (n) => n >= 1000 && n <= 2000 },
  { id: 'u3', label: '₹2,000 – ₹3,000', test: (n) => n > 2000 && n <= 3000 },
  { id: 'o3', label: 'Over ₹3,000', test: (n) => n > 3000 },
];
const SORTS = {
  relevance: { label: 'Most relevant', fn: () => 0 },
  new: { label: 'Newest', fn: (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) },
  low: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  high: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
};
const COLOUR_SWATCHES = [['Sand', '#D8C8AE'], ['Sage', '#9DAE97'], ['Navy', '#2B3A55'], ['White', '#F4F3EF'], ['Black', '#1F2023']];

/**
 * /search?q=linen  (+ optional &sale=1)
 * Filters live in the URL too (cat, price, sort) so results can be shared and the back button works.
 */
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const saleOnly = params.get('sale') === '1';
  const cats = params.getAll('cat');
  const price = params.get('price') ?? 'any';
  const sort = params.get('sort') ?? 'relevance';
  const [filtersOpen, setFiltersOpen] = useState(false); // phone only

  function update(changes) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => {
      next.delete(k);
      if (Array.isArray(v)) v.forEach((x) => next.append(k, x));
      else if (v != null && v !== '' && !(k === 'price' && v === 'any') && !(k === 'sort' && v === 'relevance')) next.set(k, v);
    });
    setParams(next, { replace: true });
  }

  const matches = useMemo(() => {
    const found = searchProducts(q);
    return saleOnly ? found.filter((p) => p.was) : found;
  }, [q, saleOnly]);

  const range = PRICE_RANGES.find((r) => r.id === price) ?? PRICE_RANGES[0];
  const results = matches
    .filter((p) => (cats.length === 0 || cats.includes(p.category)) && range.test(p.price))
    .slice()
    .sort(SORTS[sort]?.fn ?? SORTS.relevance.fn);

  const chips = [
    ...cats.map((c) => ({ label: c, remove: () => update({ cat: cats.filter((x) => x !== c) }) })),
    ...(price !== 'any' ? [{ label: range.label, remove: () => update({ price: 'any' }) }] : []),
  ];
  const clearAll = () => update({ cat: [], price: 'any' });

  const heading = saleOnly && !q ? 'Sale' : q ? (matches.length ? `Results for “${q}”` : `No results for “${q}”`) : 'All products';
  const searchHref = (t) => `/search?q=${encodeURIComponent(t)}`;

  return (
    <main className={`${container} pb-20 pt-6`}>
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Link to="/" className="text-muted no-underline hover:underline">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-ink">Search</span>
      </nav>

      <div className="mb-7 flex flex-col gap-3.5">
        <h1 aria-live="polite" className="m-0 font-display text-[32px] font-bold leading-tight tracking-tight">{heading}</h1>
        {matches.length > 0 && q && SEARCH_TERMS.some((t) => t.includes(q.toLowerCase()) && t !== q.toLowerCase()) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-muted">Related:</span>
            {SEARCH_TERMS.filter((t) => t.includes(q.toLowerCase()) && t !== q.toLowerCase()).slice(0, 4).map((t) => (
              <Link key={t} to={searchHref(t)} className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-3.5 text-sm text-ink no-underline hover:border-ink hover:text-ink">
                {t}
              </Link>
            ))}
          </div>
        )}
      </div>

      {matches.length === 0 ? (
        <NoResults searchHref={searchHref} />
      ) : (
        <div className="flex flex-wrap items-start gap-10">
          {/* Filters */}
          <aside aria-label="Filters" className={cx('max-w-full flex-[1_1_240px] flex-col gap-7 md:flex', filtersOpen ? 'flex' : 'hidden')}>
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-lg font-bold">Filters</h2>
              {chips.length > 0 && (
                <button type="button" onClick={clearAll} className="h-9 px-1 text-sm font-semibold text-brand hover:underline">Clear all</button>
              )}
            </div>

            <fieldset className="m-0 flex flex-col gap-1 border-0 p-0">
              <legend className="mb-2.5 p-0 text-[15px] font-semibold">Category</legend>
              {CATEGORIES.map((c) => {
                const n = matches.filter((p) => p.category === c).length;
                if (!n) return null;
                const checked = cats.includes(c);
                return (
                  <label key={c} className="flex min-h-10 cursor-pointer items-center gap-3 text-[15px]">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => update({ cat: checked ? cats.filter((x) => x !== c) : [...cats, c] })}
                      className="m-0 h-[18px] w-[18px] accent-brand"
                    />
                    <span className="flex-1">{c}</span>
                    <span className="text-[13px] text-muted">{n}</span>
                  </label>
                );
              })}
            </fieldset>

            <fieldset className="m-0 flex flex-col gap-1 border-0 p-0">
              <legend className="mb-2.5 p-0 text-[15px] font-semibold">Price</legend>
              {PRICE_RANGES.map((r) => (
                <label key={r.id} className="flex min-h-10 cursor-pointer items-center gap-3 text-[15px]">
                  <input type="radio" name="price" checked={price === r.id} onChange={() => update({ price: r.id })} className="m-0 h-[18px] w-[18px] accent-brand" />
                  {r.label}
                </label>
              ))}
            </fieldset>

            {/* Colour + stock: connect to real product attributes when available */}
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-3 p-0 text-[15px] font-semibold">Colour</legend>
              <div className="flex flex-wrap gap-2.5">
                {COLOUR_SWATCHES.map(([name, hex]) => (
                  <button key={name} type="button" aria-label={name} aria-pressed="false" className="h-9 w-9 rounded-full border border-line-strong hover:ring-2 hover:ring-ink hover:ring-offset-2" style={{ backgroundColor: hex }} />
                ))}
              </div>
            </fieldset>
            <label className="flex min-h-10 cursor-pointer items-center gap-3 border-t border-line pt-4 text-[15px]">
              <input type="checkbox" className="m-0 h-[18px] w-[18px] accent-brand" />
              In stock only
            </label>

            <button type="button" onClick={() => setFiltersOpen(false)} className={cx(btn.primary, 'md:hidden')}>
              Show {results.length} results
            </button>
          </aside>

          {/* Results */}
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  aria-expanded={filtersOpen}
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-ink bg-white px-4 text-sm font-semibold md:hidden"
                >
                  <Icon name="filter" size={18} />
                  Filters{chips.length ? ` (${chips.length})` : ''}
                </button>
                <span className="text-sm text-muted">{results.length} {results.length === 1 ? 'product' : 'products'}</span>
                {chips.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={c.remove}
                    aria-label={`Remove filter ${c.label}`}
                    className="inline-flex h-[34px] items-center gap-1.5 rounded-full bg-brand-soft pl-3.5 pr-2.5 text-[13px] font-semibold text-brand-dark"
                  >
                    {c.label}
                    <Icon name="close" size={14} strokeWidth={2.25} />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2.5">
                <label htmlFor="search-sort" className="text-sm text-muted">Sort by</label>
                <select id="search-sort" value={sort} onChange={(e) => update({ sort: e.target.value })} className="h-11 rounded-[10px] border border-line bg-white px-3 text-sm">
                  {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-[14px] bg-surface px-6 py-10 text-center">
                <span className="text-base font-semibold">No products match these filters</span>
                <button type="button" onClick={clearAll} className={btn.small}>Clear filters</button>
              </div>
            ) : (
              <>
                <ProductGrid products={results} minWidth={220} />
                <p className="mt-6 text-center text-sm text-muted">You’ve seen all {results.length} results</p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function NoResults({ searchHref }) {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-start gap-10 rounded-2xl border border-dashed border-line-strong px-8 py-12">
        <div className="flex flex-[1_1_320px] flex-col gap-3">
          <Icon name="searchX" size={44} strokeWidth={1.4} className="text-muted" />
          <h2 className="m-0 text-[22px] font-bold">We couldn’t find a match</h2>
          <ul className="m-0 pl-5 text-[15px] leading-[1.8] text-body">
            <li>Check the spelling</li>
            <li>Try a more general word, like “shirt” instead of “oxford shirt”</li>
            <li>Search by category, like “footwear”</li>
          </ul>
        </div>
        <div className="flex flex-[1_1_280px] flex-col gap-3">
          <span className="text-[15px] font-semibold">Popular searches</span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((t) => (
              <Link key={t} to={searchHref(t)} className="inline-flex h-10 items-center rounded-full border border-ink bg-white px-4 text-sm font-medium text-ink no-underline hover:bg-surface hover:text-ink">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <section>
        <h2 className="m-0 mb-5 font-display text-[26px] font-bold tracking-tight">Popular right now</h2>
        <ProductGrid products={products.filter((p) => p.popular).slice(0, 4)} minWidth={220} />
      </section>
    </div>
  );
}
