import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import SearchSuggestions from './SearchSuggestions.jsx';
import { cx } from '../../lib/format.js';

/**
 * Search input with a suggestions dropdown.
 * variant="desktop": compact box in the header row.
 * variant="mobile":  full-width bar with a "Search" button and close (✕) button.
 */
export default function SearchBox({ variant = 'desktop', autoFocus = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(autoFocus);
  const wrapRef = useRef(null);
  const listId = useId();
  const inputId = useId();
  const isMobile = variant === 'mobile';

  // Close the dropdown when the page changes or on outside click.
  useEffect(() => setOpen(false), [location.pathname, location.search]);
  useEffect(() => {
    function handle(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function submit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onClose?.();
  }

  function pick() {
    setOpen(false);
    onClose?.();
  }

  return (
    <div ref={wrapRef} className={cx('relative', isMobile ? 'w-full' : 'w-[320px]')}>
      <form role="search" onSubmit={submit} className="flex items-center gap-2">
        <div
          className={cx(
            'flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border pl-3.5',
            isMobile ? 'h-12 border-ink bg-white pr-3.5' : 'h-11 bg-surface pr-1',
            !isMobile && (open ? 'border-ink' : 'border-line'),
          )}
        >
          <Icon name="search" size={18} className="shrink-0 text-muted" />
          <label htmlFor={inputId} className="sr-only">
            Search products
          </label>
          <input
            id={inputId}
            type="search"
            autoComplete="off"
            autoFocus={autoFocus}
            aria-controls={open ? listId : undefined}
            aria-expanded={open}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            placeholder="Search products"
            className={cx(
              'min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted',
              // 16px on phones stops iOS zooming into the field
              isMobile ? 'text-base' : 'text-sm',
            )}
          />
          {!isMobile && (
            <button
              type="submit"
              aria-label="Search"
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[7px] bg-brand text-white hover:bg-brand-dark"
            >
              <Icon name="search" size={18} />
            </button>
          )}
        </div>
        {isMobile && (
          <>
            <button type="submit" className="h-12 shrink-0 rounded-[10px] bg-brand px-4 text-[15px] font-semibold text-white">
              Search
            </button>
            <button
              type="button"
              aria-label="Close search"
              onClick={onClose}
              className="-mr-2 flex h-12 w-11 shrink-0 items-center justify-center text-ink"
            >
              <Icon name="close" size={22} />
            </button>
          </>
        )}
      </form>
      {open && <SearchSuggestions id={listId} query={query} onPick={pick} />}
    </div>
  );
}
