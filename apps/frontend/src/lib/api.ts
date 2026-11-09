import { academyMocks } from './academyMocks';
import { supabase } from './supabase';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

function mockResponse<T>(path: string): T | undefined {
  if (path === '/academy/paths') return academyMocks.paths as T;
  if (path.startsWith('/academy/paths/') && path.endsWith('/modules')) {
    const pathId = path.split('/')[3];
    const academyPath = academyMocks.paths.find((item) => item.id === pathId || item.slug === pathId);
    return academyMocks.modules.filter((module) => academyPath?.moduleIds.includes(module.id)) as T;
  }
  if (path === '/academy/modules') return academyMocks.modules as T;
  if (path.startsWith('/academy/modules/')) return academyMocks.modules.find((module) => module.id === path.split('/')[3]) as T | undefined;
  if (path === '/academy/scenarios') return academyMocks.scenarios as T;
  if (path === '/academy/labs') return academyMocks.labs as T;
  if (path.startsWith('/academy/labs/')) return academyMocks.labs.find((lab) => lab.id === path.split('/')[3]) as T | undefined;
  if (path === '/academy/resources') return academyMocks.resources as T;
  return undefined;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (useMocks) {
    const value = mockResponse<T>(path);
    if (value !== undefined) return value;
    throw new ApiError(404, `Mock endpoint not found: ${path}`);
  }
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) headers.set('Authorization', `Bearer ${data.session.access_token}`);
  }
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });
  if (!response.ok) throw new ApiError(response.status, await response.text() || response.statusText);
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};
