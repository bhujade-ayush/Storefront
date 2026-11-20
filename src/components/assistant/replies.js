// Scripted replies so the UI works without a backend.
// Replace `getReply` with a call to your AI service. Keep the same reply shape:
//
//   {
//     text: string,                 // always
//     list?: string[],              // bullet list
//     productIds?: string[],        // product cards with "Add" buttons
//     compare?: { columns: string[], rows: string[][] },  // comparison table
//     order?: { id, summary, steps: [{ label, when, done }] }, // tracking card
//     chips?: string[],             // suggested follow-ups
//   }

import { products } from '../../data/products.js';

export const WELCOME = {
  text: 'Hi! I can help you find products, compare options, pick the right size, or check on an order. What are you looking for today?',
  chips: ['Find a linen shirt under ₹2,000', 'What goes with canvas sneakers?', 'Help me pick a size', 'Where is my order?'],
};

const SCRIPTS = {
  'Find a linen shirt under ₹2,000': {
    text: 'Here are two linen shirts under ₹2,000. The relaxed fit is the cooler choice for hot days; the camp-collar style looks a little dressier.',
    productIds: ['relaxed-linen-shirt', 'linen-camp-collar-shirt'],
    chips: ['Compare these two', 'Show me trousers to match'],
  },
  'Compare these two': {
    text: 'Here is how they compare:',
    compare: {
      columns: ['', 'Relaxed linen', 'Camp-collar'],
      rows: [
        ['Fit', 'Relaxed', 'Regular'],
        ['Collar', 'Button-down', 'Open camp'],
        ['Colours', '4', '3'],
        ['Price', '₹1,899', '₹1,699'],
      ],
    },
    chips: ['Help me pick a size', 'Show me trousers to match'],
  },
  'Show me trousers to match': {
    text: 'Both of these work with either shirt. Linen trousers keep the look light; chinos are easier to dress up.',
    productIds: ['linen-blend-trousers', 'straight-fit-chinos'],
    chips: ['Help me pick a size'],
  },
  'What goes with canvas sneakers?': {
    text: 'Canvas sneakers go with almost anything casual. A few easy pairings:',
    productIds: ['straight-fit-chinos', 'classic-cotton-crew-tee', 'canvas-tote-bag'],
    chips: ['Find a linen shirt under ₹2,000'],
  },
  'Help me pick a size': {
    text: 'Sure. Our shirts fit true to size. As a quick guide:',
    list: ['S — chest 36–38 in', 'M — chest 38–40 in', 'L — chest 40–42 in', 'XL — chest 42–44 in'],
    chips: ['I usually wear M in other brands'],
  },
  'I usually wear M in other brands': {
    text: 'Then M should fit you well. If you like a looser fit, go one size up — returns and exchanges are free for 30 days.',
    chips: ['Find a linen shirt under ₹2,000'],
  },
  'Where is my order?': {
    text: 'Your latest order has shipped and is on its way.',
    order: {
      id: 'SF-10482',
      summary: '3 items · ₹4,096',
      steps: [
        { label: 'Order placed', when: 'Fri, 20 Nov', done: true },
        { label: 'Shipped', when: 'Sat, 21 Nov', done: true },
        { label: 'Out for delivery', when: '', done: false },
        { label: 'Delivered', when: 'Expected Tue, 24 Nov', done: false },
      ],
    },
    chips: ['Change delivery address', 'Talk to a person'],
  },
  'Change delivery address': {
    text: 'Your order has already shipped, so I can’t change the address here. Our support team can try to redirect it with the courier.',
    chips: ['Talk to a person'],
  },
  'Talk to a person': {
    text: 'I’ll connect you with our support team. They’re available 9am – 9pm, and you’ll get a reply in this chat.',
  },
};

/** Returns a reply object (see shape above). Async so a real API can drop in. */
export async function getReply(message) {
  await new Promise((r) => setTimeout(r, 900)); // simulated thinking time
  if (SCRIPTS[message]) return SCRIPTS[message];

  const words = message.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const found = products
    .filter((p) => words.some((w) => `${p.name} ${p.category}`.toLowerCase().includes(w)))
    .slice(0, 3);

  if (found.length) {
    return {
      text: `Here’s what I found for “${message}”:`,
      productIds: found.map((p) => p.id),
      chips: ['Help me pick a size'],
    };
  }
  return {
    text: `I couldn’t find anything for “${message}”. Try telling me what it’s for, a colour, or your budget.`,
    chips: ['Find a linen shirt under ₹2,000', 'What goes with canvas sneakers?'],
  };
}
