import { inr, cx } from '../../lib/format.js';

export default function Price({ price, was, size = 'md' }) {
  const main = size === 'lg' ? 'text-[28px]' : 'text-[17px]';
  const old = size === 'lg' ? 'text-lg' : 'text-sm';
  return (
    <div className="flex items-baseline gap-2">
      <span className={cx('font-bold', main)}>{inr(price)}</span>
      {was && (
        <s className={cx('text-muted', old)}>
          <span className="sr-only">Was </span>
          {inr(was)}
        </s>
      )}
    </div>
  );
}
