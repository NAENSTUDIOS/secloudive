import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import type { AppRole, Profile } from '../types';
type BackendUser = { id: string; email: string; name: string | null; isAdmin: boolean; role?: string };

type AuthContextValue = {
  session: Session | null;
  user: User | BackendUser | null;
  profile: Profile | null;
  loading: boolean;
  role: AppRole;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    void Promise.all([authService.getSession(), authService.getBackendSession()]).then(([sessionResult, backendSession]) => {
      if (active) {
        setSession(sessionResult.data.session);
        setBackendUser(backendSession);
        if (!sessionResult.data.session && !backendSession) setLoading(false);
      }
    }).catch(() => {
      if (active) setLoading(false);
    });

    const { data: subscription } = authService.onAuthStateChange((nextSession) => {
      setSession(nextSession);
      setLoading(Boolean(nextSession));
      if (!nextSession) {
        setProfile(null);
        if (!nextSession) void authService.getBackendSession().then(setBackendUser).catch(() => setBackendUser(null));
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
    setProfile(data as Profile | null);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? backendUser,
    profile,
    loading,
    role: profile?.is_admin || profile?.role === 'admin' || backendUser?.isAdmin || backendUser?.role === 'admin' ? 'admin' : 'user',
    refreshProfile,
    signOut: async () => { await authService.logout(); },
  }), [backendUser, loading, profile, refreshProfile, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
