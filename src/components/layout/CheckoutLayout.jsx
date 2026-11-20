import { Outlet } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import { Logo } from './Header.jsx';
import { container } from '../ui/styles.js';

/** Minimal header for checkout: no nav, search or assistant to distract. */
export default function CheckoutLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-line">
        <div className={`${container} flex h-[72px] items-center justify-between gap-4`}>
          <Logo />
          <span className="inline-flex items-center gap-2 text-sm text-body">
            <Icon name="lock" size={18} className="text-success" />
            Secure checkout
          </span>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
