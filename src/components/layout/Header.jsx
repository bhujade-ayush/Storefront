import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import SearchBox from '../search/SearchBox.jsx';
import { btn, container } from '../ui/styles.js';
import { useCart } from '../../context/CartContext.jsx';

export const NAV_LINKS = [
  { label: 'New in', to: '/search?q=' },
  { label: 'Clothing', to: '/search?q=clothing' },
  { label: 'Footwear', to: '/search?q=footwear' },
  { label: 'Accessories', to: '/search?q=accessories' },
  { label: 'Sale', to: '/search?sale=1', sale: true },
];

export function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className={`font-display text-[22px] font-bold tracking-tight no-underline ${light ? 'text-white hover:text-white' : 'text-ink hover:text-ink'}`}
    >
      Storefront
    </Link>
  );
}

export default function Header() {
  const { count } = useCart();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false); // phone search bar
  const [menuOpen, setMenuOpen] = useState(false); // phone nav menu

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className="border-b border-line bg-white">
      <div className={`${container} flex h-[72px] items-center gap-6`}>
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className={`${btn.icon} -ml-2.5 md:hidden`}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>

        <Logo />

        <nav aria-label="Main" className="hidden gap-7 text-[15px] font-medium md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={`no-underline hover:underline ${l.sale ? 'text-sale hover:text-sale' : 'text-ink hover:text-ink'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="hidden md:block">
          <SearchBox variant="desktop" />
        </div>

        <div className="-mr-2.5 flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            aria-controls="mobile-search"
            onClick={() => setSearchOpen((v) => !v)}
            className={`${btn.icon} md:hidden`}
          >
            <Icon name="search" size={22} />
          </button>
          <button type="button" aria-label="Account" className={`${btn.icon} hidden md:inline-flex`}>
            <Icon name="user" size={22} />
          </button>
          <button type="button" aria-label="Wishlist" className={`${btn.icon} hidden md:inline-flex`}>
            <Icon name="heart" size={22} />
          </button>
          <Link to="/cart" aria-label={`Cart, ${count} items`} className={`${btn.icon} relative`}>
            <Icon name="bag" size={22} />
            <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-white">
              {count}
            </span>
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div id="mobile-search" className="px-4 pb-3.5 md:hidden">
          <SearchBox variant="mobile" autoFocus onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-line px-4 py-2 md:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={`flex min-h-12 items-center border-b border-line text-base font-medium no-underline last:border-0 ${l.sale ? 'text-sale' : 'text-ink'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
