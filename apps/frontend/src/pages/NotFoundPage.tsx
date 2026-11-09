import { Link } from 'react-router-dom';
export function NotFoundPage() { return <div className="mx-auto max-w-lg py-20 text-center"><p className="eyebrow">404</p><h1 className="text-4xl font-bold">Page not found</h1><p className="mt-3 text-slate-400">The page you requested does not exist.</p><Link className="button-primary mt-8 inline-flex" to="/">Return home</Link></div>; }
