import { Link } from 'react-router-dom';
import { container } from '../ui/styles.js';

const COLUMNS = [
  { title: 'Shop', links: [['New in', '/search?q='], ['Clothing', '/search?q=clothing'], ['Footwear', '/search?q=footwear'], ['Sale', '/search?sale=1']] },
  { title: 'Help', links: [['Track order', '#'], ['Shipping', '#'], ['Returns & refunds', '#'], ['Contact us', '#']] },
  { title: 'Company', links: [['About', '#'], ['Careers', '#'], ['Privacy policy', '#'], ['Terms', '#']] },
];

const linkClass = 'text-[#C7CAD1] no-underline hover:text-white';

/** `compact` = one-row footer used on product, cart and search pages. */
export default function Footer({ compact = false }) {
  if (compact) {
    return (
      <footer className="bg-ink text-[#C7CAD1]">
        <div className={`${container} flex flex-wrap items-center justify-between gap-4 py-8 text-[13px]`}>
          <span className="font-display text-xl font-bold text-white">Storefront</span>
          <nav aria-label="Footer" className="flex flex-wrap gap-5">
            {['Help', 'Returns', 'Privacy', 'Terms'].map((t) => (
              <a key={t} href="#" className={linkClass}>
                {t}
              </a>
            ))}
          </nav>
          <span>© {new Date().getFullYear()} Storefront</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-ink text-[#C7CAD1]">
      <div className={`${container} grid gap-8 pb-8 pt-14 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]`}>
        <div className="flex flex-col gap-3">
          <span className="font-display text-[22px] font-bold text-white">Storefront</span>
          <p className="m-0 text-sm leading-relaxed">Everyday essentials, made to last.</p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2.5 text-sm">
            <span className="mb-1 font-semibold text-white">{col.title}</span>
            {col.links.map(([label, to]) =>
              to.startsWith('/') ? (
                <Link key={label} to={to} className={linkClass}>
                  {label}
                </Link>
              ) : (
                <a key={label} href={to} className={linkClass}>
                  {label}
                </a>
              ),
            )}
          </nav>
        ))}
      </div>
      <div className={`${container} border-t border-[#2E3138] pb-8 pt-5 text-[13px]`}>
        © {new Date().getFullYear()} Storefront. All rights reserved.
      </div>
    </footer>
  );
}
