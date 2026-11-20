import { Link } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import { products, SEARCH_TERMS, POPULAR_SEARCHES } from '../../data/products.js';
import { inr } from '../../lib/format.js';

const RECENT_SEARCHES = ['linen shirt', 'sneakers']; // replace with the shopper's real history

const rowClass =
  'flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] text-ink no-underline hover:bg-surface hover:text-ink';
const labelClass = 'px-3 pb-1 pt-2.5 text-xs font-semibold uppercase tracking-wider text-muted';

const searchHref = (q) => `/search?q=${encodeURIComponent(q)}`;

/** Dropdown under the search box. `onPick` closes it after a choice. */
export default function SearchSuggestions({ id, query, onPick }) {
  const q = query.trim().toLowerCase();
  const terms = q ? SEARCH_TERMS.filter((t) => t.includes(q) && t !== q).slice(0, 4) : [];
  const matches = q ? products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3) : [];

  return (
    <div
      id={id}
      className="absolute inset-x-0 top-[calc(100%+8px)] z-50 flex flex-col rounded-xl border border-line bg-white p-2 shadow-[0_12px_32px_rgba(22,24,29,0.14)] md:left-auto md:w-[420px]"
    >
      {!q && (
        <>
          <div className={labelClass}>Recent searches</div>
          {RECENT_SEARCHES.map((t) => (
            <Link key={t} to={searchHref(t)} onClick={onPick} className={rowClass}>
              <Icon name="clock" size={18} className="text-muted" />
              {t}
            </Link>
          ))}
          <div className={`${labelClass} pt-3.5`}>Popular</div>
          <div className="flex flex-wrap gap-2 px-3 pb-2.5 pt-1.5">
            {POPULAR_SEARCHES.map((t) => (
              <Link
                key={t}
                to={searchHref(t)}
                onClick={onPick}
                className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-3.5 text-sm text-ink no-underline hover:border-ink hover:text-ink"
              >
                {t}
              </Link>
            ))}
          </div>
        </>
      )}

      {q && (
        <>
          <Link to={searchHref(query.trim())} onClick={onPick} className={`${rowClass} bg-surface`}>
            <Icon name="search" size={18} className="text-brand" />
            <span>
              Search for “<strong>{query.trim()}</strong>”
            </span>
          </Link>

          {terms.length > 0 && (
            <>
              <div className={labelClass}>Suggestions</div>
              {terms.map((t) => (
                <Link key={t} to={searchHref(t)} onClick={onPick} className={rowClass}>
                  <Icon name="search" size={18} className="text-muted" />
                  {t}
                </Link>
              ))}
            </>
          )}

          {matches.length > 0 && (
            <>
              <div className={labelClass}>Products</div>
              {matches.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  onClick={onPick}
                  className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-ink no-underline hover:bg-surface hover:text-ink"
                >
                  <span aria-hidden="true" className="h-[54px] w-11 shrink-0 rounded-md" style={{ backgroundColor: p.tint }} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-semibold">{p.name}</span>
                    <span className="text-[13px] text-muted">{p.category}</span>
                  </span>
                  <span className="text-sm font-bold">{inr(p.price)}</span>
                </Link>
              ))}
            </>
          )}

          {terms.length === 0 && matches.length === 0 && (
            <p className="m-0 p-3 text-sm text-muted">No suggestions. Try a different word, or see all results above.</p>
          )}

          <Link
            to={searchHref(query.trim())}
            onClick={onPick}
            className="mt-1.5 border-t border-line p-3 text-sm font-semibold no-underline"
          >
            See all results →
          </Link>
        </>
      )}
    </div>
  );
}
