import type { AuthResponse, Session, User } from '@supabase/supabase-js';
import { getSupabaseConfigError, supabase } from '../lib/supabase';
import { apiBaseUrl } from '../lib/api';

function requireSupabase() {
  if (!supabase) {
    throw new Error(getSupabaseConfigError() ?? 'Supabase is not configured.');
  }
  return supabase;
}

export const authService = {
  async getBackendSession(): Promise<{ id: string; email: string; name: string | null; isAdmin: boolean; role?: string } | null> {
    const response = await fetch(`${apiBaseUrl}/auth/me`, { credentials: 'include' });
    if (!response.ok) return null;
    return response.json();
  },
  async login(email: string, password: string): Promise<AuthResponse> {
    return requireSupabase().auth.signInWithPassword({ email: email.trim(), password });
  },

  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    return requireSupabase().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
  },

  async sendPasswordReset(email: string): Promise<{ error: Error | null }> {
    return requireSupabase().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  async updatePassword(password: string): Promise<{ data: { user: User | null }; error: Error | null }> {
    return requireSupabase().auth.updateUser({ password });
  },

  async logout(): Promise<{ error: Error | null }> {
    const supabaseResult = await requireSupabase().auth.signOut();
    await fetch(`${apiBaseUrl}/auth/logout`, { method: 'POST', credentials: 'include' });
    return supabaseResult;
  },

  async getSession(): Promise<{ data: { session: Session | null }; error: Error | null }> {
    return requireSupabase().auth.getSession();
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    return requireSupabase().auth.onAuthStateChange((_event, session) => callback(session));
  },
};
