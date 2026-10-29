import Link from 'next/link';

export default function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="portal-shell">
      <header className="portal-header">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          Secloudive
        </Link>
        <span className="portal-status">Learner portal preview</span>
      </header>
      <div className="portal-body">
        <aside className="portal-sidebar" aria-label="Learner navigation">
          <nav>
            <Link href="/portal">Dashboard</Link>
            <Link href="/portal/foundations">Foundations</Link>
            <Link href="/missions">Missions</Link>
            <Link href="/portal/jobs">Jobs & internships</Link>
            <Link href="/portal/progress">Progress</Link>
            <Link href="/portal/notes">Notes</Link>
            <Link href="/portal/settings">Settings</Link>
          </nav>
          <div className="portal-sidebar-note">
            <strong>Private by default</strong>
            <span>Portal data will only load after secure authentication.</span>
          </div>
        </aside>
        <main className="portal-main" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
