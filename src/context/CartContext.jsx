import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct, FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from '../data/products.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'storefront-cart';

const STARTER_CART = [
  { productId: 'relaxed-linen-shirt', variant: 'Sand · M', qty: 1 },
  { productId: 'canvas-tote-bag', variant: 'One size', qty: 1 },
];

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : STARTER_CART;
  } catch {
    return STARTER_CART;
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(loadCart);
  const [promo, setPromo] = useState(null); // e.g. { code: 'SAVE10', rate: 0.1 }

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — cart still works for this visit */
    }
  }, [lines]);

  const value = useMemo(() => {
    const items = lines
      .map((line) => ({ ...line, product: getProduct(line.productId) }))
      .filter((line) => line.product);
    const count = items.reduce((sum, l) => sum + l.qty, 0);
    const subtotal = items.reduce((sum, l) => sum + l.product.price * l.qty, 0);
    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
    const discount = promo ? subtotal * promo.rate : 0;

    const key = (l) => `${l.productId}|${l.variant}`;

    return {
      items,
      count,
      subtotal,
      delivery,
      discount,
      total: subtotal + delivery - discount,
      promo,
      addItem(productId, { variant = 'Standard', qty = 1 } = {}) {
        setLines((prev) => {
          const existing = prev.find((l) => key(l) === `${productId}|${variant}`);
          if (existing) {
            return prev.map((l) => (l === existing ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
          }
          return [...prev, { productId, variant, qty }];
        });
      },
      setQty(line, qty) {
        setLines((prev) => prev.map((l) => (key(l) === key(line) ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l)));
      },
      removeItem(line) {
        setLines((prev) => prev.filter((l) => key(l) !== key(line)));
      },
      clearCart() {
        setLines([]);
        setPromo(null);
      },
      applyPromo(code) {
        // Validate codes on your server in production.
        if (code.trim().toUpperCase() === 'SAVE10') {
          setPromo({ code: 'SAVE10', rate: 0.1 });
          return true;
        }
        setPromo(null);
        return false;
      },
    };
  }, [lines, promo]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
