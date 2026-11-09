import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-[#070b1a] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-indigo-400/10 bg-[#070b1a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-300 font-black text-slate-950 shadow-lg shadow-indigo-500/20">S</span>
            SecLoudive
          </Link>
          <nav className="hidden items-center gap-1 text-sm text-slate-400 md:flex">
            {user && <NavLink to="/security" className={({ isActive }) => `rounded-lg px-4 py-2 transition ${isActive ? 'bg-indigo-400/10 text-indigo-300' : 'hover:bg-white/5 hover:text-white'}`}>Security center</NavLink>}
            {user && <NavLink to="/learning" className={({ isActive }) => `rounded-lg px-4 py-2 transition ${isActive ? 'bg-indigo-400/10 text-indigo-300' : 'hover:bg-white/5 hover:text-white'}`}>Learning paths</NavLink>}
            {user && <NavLink to="/academy" className={({ isActive }) => `rounded-lg px-4 py-2 transition ${isActive ? 'bg-indigo-400/10 text-indigo-300' : 'hover:bg-white/5 hover:text-white'}`}>Academy</NavLink>}
            {user && <NavLink to="/resources" className={({ isActive }) => `rounded-lg px-4 py-2 transition ${isActive ? 'bg-indigo-400/10 text-indigo-300' : 'hover:bg-white/5 hover:text-white'}`}>Resources</NavLink>}
            {user && <NavLink to="/dashboard" className={({ isActive }) => `rounded-lg px-4 py-2 transition ${isActive ? 'bg-indigo-400/10 text-indigo-300' : 'hover:bg-white/5 hover:text-white'}`}>Dashboard</NavLink>}
            {user && <NavLink to="/products" className={({ isActive }) => `rounded-lg px-4 py-2 transition ${isActive ? 'bg-indigo-400/10 text-indigo-300' : 'hover:bg-white/5 hover:text-white'}`}>Products</NavLink>}
            {user && <NavLink to="/profile" className={({ isActive }) => `rounded-lg px-4 py-2 transition ${isActive ? 'bg-indigo-400/10 text-indigo-300' : 'hover:bg-white/5 hover:text-white'}`}>Profile</NavLink>}
            {(profile?.is_admin || profile?.role === 'admin') && <NavLink to="/admin/resources" className={({ isActive }) => `rounded-lg px-4 py-2 transition ${isActive ? 'bg-indigo-400/10 text-indigo-300' : 'hover:bg-white/5 hover:text-white'}`}>Resources</NavLink>}
            {(profile?.is_admin || profile?.role === 'admin') && <NavLink to="/admin/users" className={({ isActive }) => `rounded-lg px-4 py-2 transition ${isActive ? 'bg-indigo-400/10 text-indigo-300' : 'hover:bg-white/5 hover:text-white'}`}>Admin</NavLink>}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden max-w-36 truncate text-sm text-slate-400 sm:inline">{profile?.full_name ?? user.email}</span>
                <button onClick={handleSignOut} className="button-secondary">Log out</button>
              </> 
            ) : <Link to="/login" className="button-primary">Log in</Link>}
          </div>
        </div>
      </header>
      {user && <div className="border-b border-indigo-400/10 bg-indigo-400/[0.03] md:hidden"><nav className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 py-2 text-sm"><NavLink to="/security" className="whitespace-nowrap rounded-lg px-3 py-2 text-slate-400">Security</NavLink><NavLink to="/academy" className="whitespace-nowrap rounded-lg px-3 py-2 text-slate-400">Academy</NavLink><NavLink to="/resources" className="whitespace-nowrap rounded-lg px-3 py-2 text-slate-400">Resources</NavLink><NavLink to="/scenarios" className="whitespace-nowrap rounded-lg px-3 py-2 text-slate-400">Scenarios</NavLink><NavLink to="/profile" className="whitespace-nowrap rounded-lg px-3 py-2 text-slate-400">Profile</NavLink>{(profile?.is_admin || profile?.role === 'admin') && <NavLink to="/admin/resources" className="whitespace-nowrap rounded-lg px-3 py-2 text-slate-400">Admin</NavLink>}</nav></div>}
      <main className={`mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:py-10 ${location.pathname === '/' ? '' : ''}`}><Outlet /></main>
    </div>
  );
}
