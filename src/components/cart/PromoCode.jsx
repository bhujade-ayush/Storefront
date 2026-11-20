import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { btn, input } from '../ui/styles.js';
import { cx } from '../../lib/format.js';

export default function PromoCode() {
  const { applyPromo, promo } = useCart();
  const [code, setCode] = useState(promo?.code ?? '');
  const [error, setError] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(!applyPromo(code));
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor="promo" className="text-sm font-semibold">Promo code</label>
      <div className="flex gap-2">
        <input
          id="promo"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Try SAVE10"
          aria-invalid={error}
          aria-describedby={error ? 'promo-error' : undefined}
          className={cx(input, 'h-11 flex-1')}
        />
        <button type="submit" className={btn.small}>Apply</button>
      </div>
      {error && <span id="promo-error" role="alert" className="text-[13px] text-sale">That code isn’t valid.</span>}
      {promo && !error && <span role="status" className="text-[13px] text-success">{promo.code} applied — 10% off.</span>}
    </form>
  );
}
