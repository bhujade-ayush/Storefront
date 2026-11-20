import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import AssistantLauncher from '../assistant/AssistantLauncher.jsx';

export function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2.5 text-center text-[13px] text-white">
      Free delivery on orders over ₹999 · Easy 30-day returns
    </div>
  );
}

/** Announcement bar + header + page + footer + assistant button. */
export default function StoreLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer compact={!isHome} />
      <AssistantLauncher />
    </div>
  );
}
