import { Link } from 'react-router-dom';
import { btn, container } from '../components/ui/styles.js';

export default function NotFoundPage() {
  return (
    <main className={`${container} flex flex-col items-center gap-4 py-24 text-center`}>
      <h1 className="m-0 font-display text-4xl font-bold">Page not found</h1>
      <p className="m-0 text-muted">The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/" className={btn.primary}>Back to home</Link>
    </main>
  );
}
