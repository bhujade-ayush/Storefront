import Icon from './Icon.jsx';
import { cx } from '../../lib/format.js';

/**
 * Image box for a product. Shows the photo when `src` is given,
 * otherwise a tinted placeholder so layouts stay intact.
 */
export default function ProductImage({ src, alt = '', tint = '#E6E1D8', className = '', iconSize = 30, caption }) {
  if (src) {
    return <img src={src} alt={alt} className={cx('h-full w-full object-cover', className)} />;
  }
  return (
    <div
      className={cx('flex flex-col items-center justify-center gap-2 text-[#4A5568]', className)}
      style={{ backgroundColor: tint }}
    >
      <Icon name="image" size={iconSize} strokeWidth={1.5} />
      {caption && <span className="text-sm font-medium">{caption}</span>}
    </div>
  );
}
