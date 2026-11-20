import { Link } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import { getProduct } from '../../data/products.js';
import { useCart } from '../../context/CartContext.jsx';
import { inr } from '../../lib/format.js';

const card = 'rounded-xl border border-line bg-white';

export function UserBubble({ text }) {
  return (
    <div className="max-w-[85%] self-end rounded-2xl rounded-br-[4px] bg-ink px-4 py-3 text-[15px] leading-normal text-white">
      {text}
    </div>
  );
}

export function BotText({ text }) {
  return (
    <div className="max-w-[92%] self-start rounded-2xl rounded-bl-[4px] border border-line bg-white px-4 py-3 text-[15px] leading-relaxed">
      {text}
    </div>
  );
}

export function BotList({ items }) {
  return (
    <ul className={`${card} m-0 max-w-[92%] py-3 pl-8 pr-4 text-sm leading-[1.8]`}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export function ProductList({ productIds, onNavigate }) {
  const { items, addItem } = useCart();
  return (
    <div className={`${card} overflow-hidden`}>
      {productIds.map((id) => {
        const p = getProduct(id);
        if (!p) return null;
        const inCart = items.some((l) => l.productId === id);
        return (
          <div key={id} className="flex items-center gap-3 border-b border-[#EFEFEB] p-3 last:border-0">
            <span aria-hidden="true" className="h-[68px] w-14 shrink-0 rounded-lg" style={{ backgroundColor: p.tint }} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <Link to={`/product/${p.id}`} onClick={onNavigate} className="text-sm font-semibold text-ink no-underline hover:text-brand">
                {p.name}
              </Link>
              <span className="text-[13px] text-muted">{p.category}</span>
              <span className="text-[15px] font-bold">{inr(p.price)}</span>
            </div>
            {inCart ? (
              <span className="flex h-10 shrink-0 items-center rounded-[10px] bg-[#DCFCE7] px-3 text-[13px] font-semibold text-success">
                In cart ✓
              </span>
            ) : (
              <button
                type="button"
                onClick={() => addItem(p.id)}
                aria-label={`Add ${p.name} to cart`}
                className="h-10 shrink-0 rounded-[10px] border border-ink bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-surface"
              >
                Add
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CompareTable({ columns, rows }) {
  return (
    <div className={`${card} overflow-x-auto`}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-surface text-left text-[13px]">
            {columns.map((c, i) => (
              <th key={i} scope="col" className="px-3.5 py-2.5 font-bold">
                {c || <span className="sr-only">Feature</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-[#EFEFEB]">
              <th scope="row" className="px-3.5 py-2.5 text-left font-normal text-muted">
                {r[0]}
              </th>
              {r.slice(1).map((cell, i) => (
                <td key={i} className="px-3.5 py-2.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OrderCard({ order }) {
  return (
    <div className={`${card} flex flex-col gap-3.5 p-4`}>
      <div className="flex justify-between gap-3 text-sm">
        <span className="font-bold">Order #{order.id}</span>
        <span className="text-muted">{order.summary}</span>
      </div>
      <ol aria-label="Order progress" className="m-0 flex list-none flex-col gap-2.5 p-0">
        {order.steps.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-sm">
            {s.done ? (
              <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                <Icon name="check" size={12} strokeWidth={3} />
              </span>
            ) : (
              <span aria-hidden="true" className="h-5 w-5 rounded-full border-2 border-line-strong" />
            )}
            <span className={s.done ? 'font-semibold' : 'text-muted'}>
              {s.label}
              <span className="sr-only">{s.done ? ' (done)' : ' (to come)'}</span>
            </span>
            <span className="ml-auto text-[13px] text-muted">{s.when}</span>
          </li>
        ))}
      </ol>
      <a href="#" className="text-sm font-semibold">
        View order details
      </a>
    </div>
  );
}

export function Feedback() {
  const cls = 'flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink';
  return (
    <div className="-mt-1 flex items-center gap-0.5">
      <button type="button" aria-label="Helpful" className={cls}>
        <Icon name="thumbUp" size={16} />
      </button>
      <button type="button" aria-label="Not helpful" className={cls}>
        <Icon name="thumbDown" size={16} />
      </button>
    </div>
  );
}

export function Chips({ chips, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onPick(c)}
          className="min-h-10 rounded-full border border-[#BFCCF5] bg-white px-3.5 py-2 text-left text-sm font-medium text-brand-dark hover:bg-brand-soft"
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="Assistant is typing"
      className="flex gap-1.5 self-start rounded-2xl rounded-bl-[4px] border border-line bg-white px-4 py-3.5"
    >
      <span className="typing-dot h-[7px] w-[7px] rounded-full bg-muted" />
      <span className="typing-dot h-[7px] w-[7px] rounded-full bg-muted" />
      <span className="typing-dot h-[7px] w-[7px] rounded-full bg-muted" />
    </div>
  );
}
