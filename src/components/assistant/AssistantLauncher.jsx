import Icon from '../ui/Icon.jsx';
import { useAssistant } from '../../context/AssistantContext.jsx';

/** Floating "Ask assistant" button, bottom-right on every store page. */
export default function AssistantLauncher() {
  const { isOpen, open } = useAssistant();
  if (isOpen) return null;
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Ask the shopping assistant"
      className="fixed bottom-6 right-6 z-40 inline-flex h-[52px] items-center gap-2.5 rounded-full bg-brand px-4 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(29,78,216,0.35)] hover:bg-brand-dark"
    >
      <Icon name="chatDots" size={22} />
      <span className="hidden pr-1 md:inline">Ask assistant</span>
    </button>
  );
}
