'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Unhandled page error', error);
    }
  }, [error]);

  return (
    <main className="section-shell section-block">
      <p className="eyebrow">Something went wrong</p>
      <h1>We could not load this page.</h1>
      <p className="hero-summary">
        Your progress is not changed by this error. Try again or return home.
      </p>
      <div className="action-row">
        <button className="button button-primary" onClick={reset} type="button">
          Try again
        </button>
        <Link className="button button-secondary" href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
