import { cx } from '../../lib/format.js';

export default function QuantityStepper({ value, onChange, min = 1, max = 10, label = 'Quantity', size = 'md' }) {
  const h = size === 'lg' ? 'h-[52px]' : 'h-11';
  const w = size === 'lg' ? 'w-12' : 'w-11';
  return (
    <div role="group" aria-label={label} className={cx('inline-flex items-center rounded-[10px] border border-line-strong', h)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cx('h-full text-xl text-ink disabled:text-line-strong', w)}
      >
        −
      </button>
      <span aria-live="polite" className="min-w-8 text-center font-semibold">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cx('h-full text-xl text-ink disabled:text-line-strong', w)}
      >
        +
      </button>
    </div>
  );
}
