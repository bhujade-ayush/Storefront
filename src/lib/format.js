/** Format a number as Indian rupees, e.g. 1899 → "₹1,899". */
export function inr(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

/** Join class names, skipping falsy values. */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
