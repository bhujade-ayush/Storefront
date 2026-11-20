import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon.jsx';
import OrderTotals from '../components/cart/OrderTotals.jsx';
import { btn, container, input, label } from '../components/ui/styles.js';
import { useCart } from '../context/CartContext.jsx';
import { inr, cx } from '../lib/format.js';

const STATES = ['Delhi', 'Jharkhand', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'West Bengal'];
const EXPRESS_FEE = 149;
const PAYMENTS = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Card' },
  { id: 'net', label: 'Net banking' },
  { id: 'cod', label: 'Cash on delivery' },
];

function Field({ id, children, text, className = '', ...props }) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={label}>{text}</label>
      {children ?? <input id={id} className={input} {...props} />}
    </div>
  );
}

function Steps({ current }) {
  const steps = ['Cart', 'Details & payment', 'Confirmation'];
  return (
    <ol aria-label="Checkout progress" className="m-0 mb-9 flex list-none flex-wrap items-center gap-3 p-0 text-sm">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex items-center gap-3" aria-current={active ? 'step' : undefined}>
            {i > 0 && <span aria-hidden="true" className="h-px w-8 bg-line-strong" />}
            <span className={cx('inline-flex items-center gap-2', active && 'font-semibold', !done && !active && 'text-muted')}>
              <span
                className={cx(
                  'inline-flex h-[26px] w-[26px] items-center justify-center rounded-full text-[13px] font-bold',
                  done && 'bg-ink text-white',
                  active && 'bg-brand text-white',
                  !done && !active && 'border border-line-strong',
                )}
              >
                {done ? <Icon name="check" size={14} strokeWidth={3} /> : i + 1}
              </span>
              {i === 0 && done ? <Link to="/cart" className="text-ink no-underline hover:underline">{s}</Link> : s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function CheckoutPage() {
  const { items, delivery, total, clearCart } = useCart();
  const [ship, setShip] = useState('standard');
  const [pay, setPay] = useState('upi');
  const [placed, setPlaced] = useState(null); // order total once placed

  const deliveryFee = ship === 'express' ? EXPRESS_FEE : delivery;
  const grandTotal = total - delivery + deliveryFee;

  if (placed !== null) {
    return (
      <main className={`${container} pb-20 pt-8`}>
        <Steps current={2} />
        <div role="status" className="mx-auto flex max-w-[560px] flex-col items-center gap-3.5 rounded-2xl border border-line px-8 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DCFCE7] text-success">
            <Icon name="check" size={28} strokeWidth={2} />
          </span>
          <h1 className="m-0 font-display text-3xl font-bold">Order placed</h1>
          <p className="m-0 text-[15px] leading-relaxed text-muted">
            Thanks for your order of {inr(placed)}. We’ve sent a confirmation to your email with tracking details.
          </p>
          <Link to="/" className={cx(btn.primary, 'mt-2')}>Continue shopping</Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className={`${container} pb-20 pt-8 text-center`}>
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <Link to="/" className={btn.primary}>Continue shopping</Link>
      </main>
    );
  }

  function placeOrder(e) {
    e.preventDefault();
    // Send the order to your backend / payment gateway here.
    setPlaced(grandTotal);
    clearCart();
  }

  const optionClass = (checked) =>
    cx('flex cursor-pointer items-center gap-3.5 rounded-xl px-[18px]', checked ? 'border-2 border-brand' : 'border border-line-strong hover:border-ink');

  return (
    <main className={`${container} pb-20 pt-8`}>
      <Steps current={1} />
      <div className="flex flex-wrap items-start gap-10">
        <form id="checkout-form" onSubmit={placeOrder} className="flex min-w-0 flex-[999_1_560px] flex-col gap-9">
          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-xl font-bold">1. Contact</h2>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
              <Field id="email" text="Email" type="email" autoComplete="email" placeholder="you@example.com" required />
              <Field id="phone" text="Mobile number" type="tel" autoComplete="tel" placeholder="+91" required />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-xl font-bold">2. Delivery address</h2>
            <Field id="name" text="Full name" autoComplete="name" required />
            <Field id="address" text="Address" autoComplete="street-address" placeholder="House no., street, area" required />
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
              <Field id="city" text="City" autoComplete="address-level2" required />
              <Field id="state" text="State">
                <select id="state" autoComplete="address-level1" required defaultValue="" className={input}>
                  <option value="" disabled>Select state</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field id="pin" text="PIN code" inputMode="numeric" maxLength={6} pattern="\d{6}" autoComplete="postal-code" required />
            </div>
          </section>

          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="mb-4 p-0 text-xl font-bold">3. Delivery method</legend>
            {[
              { id: 'standard', label: 'Standard delivery', note: '3–5 business days', fee: delivery },
              { id: 'express', label: 'Express delivery', note: '1–2 business days', fee: EXPRESS_FEE },
            ].map((o) => (
              <label key={o.id} className={cx(optionClass(ship === o.id), 'min-h-16 py-3.5')}>
                <input type="radio" name="ship" checked={ship === o.id} onChange={() => setShip(o.id)} className="m-0 h-5 w-5 accent-brand" />
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-semibold">{o.label}</span>
                  <span className="text-[13px] text-muted">{o.note}</span>
                </span>
                <span className="text-[15px] font-semibold">{o.fee ? inr(o.fee) : 'Free'}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="mb-4 p-0 text-xl font-bold">4. Payment</legend>
            <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
              {PAYMENTS.map((p) => (
                <label key={p.id} className={cx(optionClass(pay === p.id), 'h-14 gap-2.5 px-4 text-[15px] font-semibold')}>
                  <input type="radio" name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} className="m-0 h-5 w-5 accent-brand" />
                  {p.label}
                </label>
              ))}
            </div>
            <div className="rounded-xl bg-surface p-[18px]">
              {pay === 'upi' && <Field id="upi" text="UPI ID" placeholder="name@bank" required />}
              {pay === 'upi' && <p className="m-0 mt-1.5 text-[13px] text-muted">You’ll get a payment request in your UPI app.</p>}
              {pay === 'card' && (
                <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
                  <Field id="cc" text="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" required className="col-span-full" />
                  <Field id="exp" text="Expiry" autoComplete="cc-exp" placeholder="MM / YY" required />
                  <Field id="cvv" text="CVV" inputMode="numeric" autoComplete="cc-csc" maxLength={4} required />
                </div>
              )}
              {pay === 'net' && (
                <Field id="bank" text="Choose your bank">
                  <select id="bank" required defaultValue="" className={input}>
                    <option value="" disabled>Select bank</option>
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((b) => <option key={b}>{b}</option>)}
                  </select>
                </Field>
              )}
              {pay === 'cod' && <p className="m-0 text-sm text-body">Pay in cash or UPI when your order arrives.</p>}
            </div>
          </fieldset>
        </form>

        <aside aria-label="Order summary" className="flex min-w-0 flex-[1_1_340px] flex-col gap-[18px] rounded-2xl bg-surface p-7">
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 text-xl font-bold">Order summary</h2>
            <Link to="/cart" className="text-sm font-semibold">Edit cart</Link>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {items.map((l) => (
              <li key={`${l.productId}|${l.variant}`} className="flex items-center gap-3.5">
                <span className="relative h-[68px] w-14 shrink-0 rounded-lg" style={{ backgroundColor: l.product.tint }}>
                  <span className="absolute -right-2 -top-2 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-ink px-1.5 text-xs font-bold text-white">
                    <span className="sr-only">Quantity </span>{l.qty}
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold">{l.product.name}</span>
                  <span className="text-[13px] text-muted">{l.variant}</span>
                </span>
                <span className="text-sm font-semibold">{inr(l.product.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-[#DAD9D3] pt-4">
            <OrderTotals deliveryOverride={deliveryFee} />
          </div>
          <button type="submit" form="checkout-form" className={cx(btn.primary, 'h-[52px] text-base')}>
            Place order · {inr(grandTotal)}
          </button>
          <p className="m-0 text-center text-[13px] leading-normal text-muted">
            By placing your order you agree to our <a href="#">Terms</a> and <a href="#">Privacy policy</a>.
          </p>
        </aside>
      </div>
    </main>
  );
}
