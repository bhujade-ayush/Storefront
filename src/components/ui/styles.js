// Shared Tailwind class recipes, so buttons and inputs look the same everywhere.
// Usage: <button className={btn.primary}>…</button> or <Link className={btn.secondary} …>

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 no-underline';

export const btn = {
  primary: `${base} h-12 px-6 bg-brand text-white hover:bg-brand-dark hover:text-white`,
  secondary: `${base} h-12 px-6 border border-ink bg-white text-ink hover:bg-surface hover:text-ink`,
  quiet: `${base} h-12 px-6 border border-line bg-white text-ink hover:bg-surface hover:text-ink`,
  small: `${base} h-11 px-4 text-sm border border-ink bg-white text-ink hover:bg-surface hover:text-ink`,
  icon: 'inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface hover:text-ink',
};

export const input =
  'h-12 w-full rounded-[10px] border border-line-strong bg-white px-3.5 text-[15px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

export const label = 'text-sm font-semibold text-ink';

export const container = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6';

export const h2 = 'font-display text-[26px] font-bold tracking-tight sm:text-3xl';
