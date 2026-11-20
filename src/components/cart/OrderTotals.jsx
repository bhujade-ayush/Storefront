import { useCart } from '../../context/CartContext.jsx';
import { inr } from '../../lib/format.js';

/**
 * Subtotal / delivery / discount rows and the total.
 * `showTotal={false}` hides the total; `onlyTotal` shows only the total.
 * `deliveryOverride` lets checkout swap in the chosen delivery price.
 */
export default function OrderTotals({ showTotal = true, onlyTotal = false, deliveryOverride }) {
  const { subtotal, delivery, discount, promo } = useCart();
  const deliveryFee = deliveryOverride ?? delivery;
  const total = subtotal + deliveryFee - discount;

  const totalRow = (
    <div>
      <div className="flex items-baseline justify-between border-t border-[#DAD9D3] pt-4">
        <span className="text-[17px] font-bold">Total</span>
        <span className="text-2xl font-bold">{inr(total)}</span>
      </div>
      <span className="text-[13px] text-muted">Inclusive of all taxes</span>
    </div>
  );

  if (onlyTotal) return totalRow;

  return (
    <>
      <dl className="m-0 flex flex-col gap-3 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-body">Subtotal</dt>
          <dd className="m-0 font-semibold">{inr(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-body">Delivery</dt>
          <dd className="m-0 font-semibold">{deliveryFee === 0 ? 'Free' : inr(deliveryFee)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-body">Discount ({promo.code})</dt>
            <dd className="m-0 font-semibold text-success">−{inr(discount)}</dd>
          </div>
        )}
      </dl>
      {showTotal && totalRow}
    </>
  );
}
