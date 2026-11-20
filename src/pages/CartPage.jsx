import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon.jsx';
import QuantityStepper from '../components/ui/QuantityStepper.jsx';
import OrderTotals from '../components/cart/OrderTotals.jsx';
import PromoCode from '../components/cart/PromoCode.jsx';
import { btn, container } from '../components/ui/styles.js';
import { useCart } from '../context/CartContext.jsx';
import { FREE_DELIVERY_THRESHOLD } from '../data/products.js';
import { inr, cx } from '../lib/format.js';

export default function CartPage() {
  const { items, count, subtotal, setQty, removeItem } = useCart();

  return (
    <main className={`${container} pb-20 pt-10`}>
      <h1 className="m-0 mb-2 font-display text-4xl font-bold tracking-tight">Your cart</h1>
      <p className="m-0 mb-8 text-[15px] text-muted">{count} {count === 1 ? 'item' : 'items'}</p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <Icon name="bag" size={48} strokeWidth={1.4} className="text-muted" />
          <h2 className="m-0 text-[22px] font-bold">Your cart is empty</h2>
          <p className="m-0 text-[15px] text-muted">Looks like you haven’t added anything yet.</p>
          <Link to="/" className={btn.primary}>Continue shopping</Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-10">
          {/* Items */}
          <div className="min-w-0 flex-[999_1_560px] border-t border-line">
            {items.map((line) => (
              <div key={`${line.productId}|${line.variant}`} className="flex gap-5 border-b border-line py-6">
                <span aria-hidden="true" className="h-[140px] w-28 shrink-0 rounded-xl" style={{ backgroundColor: line.product.tint }} />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex justify-between gap-4">
                    <Link to={`/product/${line.productId}`} className="text-base font-semibold text-ink no-underline hover:text-brand">
                      {line.product.name}
                    </Link>
                    <span className="whitespace-nowrap text-base font-bold">{inr(line.product.price * line.qty)}</span>
                  </div>
                  <span className="text-sm text-muted">{line.variant}</span>
                  <span className="text-sm text-muted">{inr(line.product.price)} each</span>
                  <div className="flex-1" />
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <QuantityStepper value={line.qty} onChange={(q) => setQty(line, q)} label={`Quantity for ${line.product.name}`} />
                    <div className="flex gap-1">
                      <button type="button" className="h-11 px-3 text-sm font-semibold text-brand hover:underline">Save for later</button>
                      <button
                        type="button"
                        onClick={() => removeItem(line)}
                        className="inline-flex h-11 items-center gap-1.5 px-3 text-sm font-semibold text-sale hover:underline"
                      >
                        <Icon name="trash" size={16} />
                        Remove<span className="sr-only"> {line.product.name}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold no-underline">
              <Icon name="chevronLeft" size={18} />
              Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <aside aria-label="Order summary" className="flex min-w-0 flex-[1_1_340px] flex-col gap-[18px] rounded-2xl bg-surface p-7">
            <h2 className="m-0 text-xl font-bold">Order summary</h2>
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-body">
                  Add <strong>{inr(FREE_DELIVERY_THRESHOLD - subtotal)}</strong> more for free delivery
                </span>
                <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full bg-brand" style={{ width: `${Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }} />
                </div>
              </div>
            )}
            <OrderTotals showTotal={false} />
            <PromoCode />
            <OrderTotals onlyTotal />
            <Link to="/checkout" className={cx(btn.primary, 'h-[52px] text-base')}>Proceed to checkout</Link>
            <div className="flex items-center justify-center gap-2 text-[13px] text-muted">
              <Icon name="lock" size={16} />
              Secure checkout · UPI, cards, net banking, COD
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
