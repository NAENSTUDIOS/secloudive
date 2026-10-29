import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('secloudive_session')?.value;
  // Full JWT verification will be added when Cognito is provisioned.
  // For now: presence of the cookie is the gate.
  return token ? { token } : null;
}

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">S</span>
          Secloudive
        </Link>
        <div className="portal-header-actions">
          <span className="portal-status">Learner portal</span>
          <form action="/api/auth/signout" method="POST">
            <button className="button button-quiet button-sm" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="portal-body">
        <aside className="portal-sidebar" aria-label="Learner navigation">
          <nav>
            <Link href="/portal">Dashboard</Link>
            <Link href="/portal/foundations">Foundations</Link>
            <Link href="/missions">Missions</Link>
            <Link href="/portal/jobs">Jobs &amp; internships</Link>
            <Link href="/portal/progress">Progress</Link>
            <Link href="/portal/notes">Notes</Link>
            <Link href="/portal/settings">Settings</Link>
          </nav>
          <div className="portal-sidebar-note">
            <strong>Private by default</strong>
            <span>Your notes, progress, and evidence are private unless you share them.</span>
          </div>
        </aside>
        <main className="portal-main" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
