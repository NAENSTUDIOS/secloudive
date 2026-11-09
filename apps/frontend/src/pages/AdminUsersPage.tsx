import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { EmptyState } from '../components/Toast';

export function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState('');
  async function load() {
    if (!supabase) return;
    const result = await supabase.from('profiles').select('*').order('full_name');
    if (result.error) setError(result.error.message); else setProfiles((result.data ?? []) as Profile[]);
  }
  useEffect(() => { void load(); }, []);
  async function changeRole(id: string, role: Profile['role']) {
    if (!supabase) return;
    const result = await supabase.rpc('admin_set_user_role', { target_user_id: id, next_role: role });
    if (result.error) setError(result.error.message); else await load();
  }
  return <div className="space-y-8"><div><p className="eyebrow">Administration</p><h1 className="text-4xl font-bold">Users and roles</h1><p className="mt-2 text-slate-400">Role changes are protected by database policies and recorded as activity.</p></div>{error && <p className="error">{error}</p>}{profiles.length ? <div className="panel overflow-x-auto"><table><thead><tr><th>User</th><th>Role</th><th>Action</th></tr></thead><tbody>{profiles.map((profile) => <tr key={profile.id}><td>{profile.full_name ?? profile.id}</td><td><span className="badge">{profile.role}</span></td><td><select value={profile.role} onChange={(e) => void changeRole(profile.id, e.target.value as Profile['role'])}><option value="user">User</option><option value="admin">Admin</option></select></td></tr>)}</tbody></table></div> : <EmptyState title="No profiles visible" message="Profiles will appear when users sign up and RLS permits this admin view." />}</div>;
}
