import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import { useAssistant } from '../../context/AssistantContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { WELCOME, getReply } from './replies.js';
import {
  UserBubble, BotText, BotList, ProductList, CompareTable, OrderCard, Feedback, Chips, TypingIndicator,
} from './MessageParts.jsx';

const freshChat = () => [{ role: 'bot', ...WELCOME }];

/**
 * Chat drawer. Docks on the right on desktop (store dimmed behind it),
 * fills the screen on phones.
 */
export default function AssistantPanel() {
  const { isOpen, close } = useAssistant();
  const { count } = useCart();
  const [messages, setMessages] = useState(freshChat);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const requestId = useRef(0);
  const inputId = useId();

  // Keep the newest message in view.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, typing, isOpen]);

  // Focus the input on open, close on Escape, and stop the page scrolling behind.
  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  async function send(text) {
    const q = text.trim();
    if (!q || typing) return;
    const id = ++requestId.current;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setTyping(true);
    try {
      const reply = await getReply(q);
      if (id !== requestId.current) return; // chat was reset meanwhile
      setMessages((m) => [...m, { role: 'bot', ...reply }]);
    } catch {
      if (id !== requestId.current) return;
      setMessages((m) => [...m, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      if (id === requestId.current) setTyping(false);
    }
  }

  function reset() {
    requestId.current += 1;
    setTyping(false);
    setInput('');
    setMessages(freshChat());
  }

  if (!isOpen) return null;
  const last = messages.length - 1;
  const canSend = input.trim() && !typing;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed store behind the panel (desktop) */}
      <button
        type="button"
        aria-label="Close assistant"
        onClick={close}
        className="hidden flex-1 cursor-default bg-ink/45 md:block"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Shopping assistant"
        className="flex h-full w-full flex-col bg-white md:w-[440px] md:border-l md:border-line"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-line py-3.5 pl-5 pr-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            <Icon name="chatDots" size={20} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 className="m-0 text-base font-bold">Shopping assistant</h2>
            <span className="flex items-center gap-1.5 text-[13px] text-muted">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success" />
              Online · Usually replies instantly
            </span>
          </div>
          <Link
            to="/cart"
            onClick={close}
            className="inline-flex h-9 items-center rounded-full bg-surface px-3 text-[13px] font-semibold text-ink no-underline hover:text-ink"
          >
            Cart · {count}
          </Link>
          <button
            type="button"
            aria-label="Start a new chat"
            onClick={reset}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface"
          >
            <Icon name="refresh" />
          </button>
          <button
            type="button"
            aria-label="Close assistant"
            onClick={close}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface"
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        {/* Conversation */}
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation"
          className="flex flex-1 flex-col gap-[18px] overflow-y-auto bg-canvas p-5"
        >
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <UserBubble key={i} text={m.text} />
            ) : (
              <div key={i} className="flex flex-col gap-2.5">
                <BotText text={m.text} />
                {m.list && <BotList items={m.list} />}
                {m.productIds && <ProductList productIds={m.productIds} onNavigate={close} />}
                {m.compare && <CompareTable {...m.compare} />}
                {m.order && <OrderCard order={m.order} />}
                {i > 0 && <Feedback />}
                {i === last && !typing && m.chips && <Chips chips={m.chips} onPick={send} />}
              </div>
            ),
          )}
          {typing && <TypingIndicator />}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex shrink-0 flex-col gap-2 border-t border-line bg-white px-4 pb-3.5 pt-3"
        >
          <div className="flex items-center gap-2 rounded-xl border border-line-strong py-1 pl-4 pr-1 focus-within:border-brand">
            <label htmlFor={inputId} className="sr-only">
              Message the shopping assistant
            </label>
            <input
              id={inputId}
              ref={inputRef}
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, sizes or orders…"
              className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!canSend}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand text-white disabled:bg-[#A9B4CC]"
            >
              <Icon name="arrowUp" strokeWidth={2} />
            </button>
          </div>
          <span className="text-center text-xs text-muted">The assistant can make mistakes. Check product details before you buy.</span>
        </form>
      </section>
    </div>
  );
}
