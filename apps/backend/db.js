import { createClient } from '@supabase/supabase-js';

const client = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;
export function requireDatabase() { if (!client) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'); return client; }
export async function upsertUserByGoogleId({ googleId, name, email }) {
  const { data, error } = await requireDatabase().from('users').upsert({ google_id: googleId, name, email }, { onConflict: 'google_id' }).select().single();
  if (error) throw error;
  return { id: data.id, name: data.name, email: data.email, isAdmin: data.is_admin };
}
export async function upsertUserBySupabaseUser(user) {
  const googleId = user.user_metadata?.provider_id || user.user_metadata?.sub || user.id;
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'SecLoudive user';
  const { data, error } = await requireDatabase().from('users').upsert({
    id: user.id,
    google_id: googleId,
    name,
    email: user.email,
  }, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return { id: data.id, name: data.name, email: data.email, isAdmin: Boolean(data.is_admin), role: data.is_admin ? 'admin' : 'user' };
}
export async function getSupabaseUser(accessToken) {
  const { data, error } = await requireDatabase().auth.getUser(accessToken);
  if (error) throw error;
  return data.user;
}
export async function markProgress(userId, moduleId) { const { error } = await requireDatabase().from('progress').upsert({ user_id: userId, module_id: moduleId }, { onConflict: 'user_id,module_id' }); if (error) throw error; }
export async function fetchProgress(userId) { const { data, error } = await requireDatabase().from('progress').select('module_id, completed_at').eq('user_id', userId); if (error) throw error; return data ?? []; }
export async function saveScenarioResult(userId, { scenarioId, score, rating }) { const { data, error } = await requireDatabase().from('scenario_results').insert({ user_id: userId, scenario_id: scenarioId, score, rating }).select().single(); if (error) throw error; return data; }
export async function deleteUser(userId) { const { error } = await requireDatabase().from('users').delete().eq('id', userId); if (error) throw error; }
export function getSessionUser(req) { return req.session?.user ?? null; }
export function setSessionUser(req, user) { req.session.user = user; }
export function clearSessionUser(req) { return new Promise((resolve, reject) => req.session.destroy((error) => error ? reject(error) : resolve())); }
