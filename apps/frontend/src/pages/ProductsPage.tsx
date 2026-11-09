import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types';
import { EmptyState } from '../components/Toast';

export function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState('');

  async function load() {
    if (!supabase) return;
    const result = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (result.error) setError(result.error.message);
    else setProducts((result.data ?? []) as Product[]);
  }
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  function startEdit(product?: Product) {
    setEditing(product ?? null);
    setForm(product ? { name: product.name, description: product.description, price: String(product.price) } : { name: '', description: '', price: '' });
    setError('');
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !user) return;
    const payload = { name: form.name.trim(), description: form.description.trim(), price: Number(form.price) };
    const result = editing ? await supabase.from('products').update(payload).eq('id', editing.id) : await supabase.from('products').insert({ ...payload, owner_id: user.id });
    if (result.error) setError(result.error.message);
    else { setEditing(null); await load(); }
  }
  async function remove(id: string) {
    if (!supabase || !window.confirm('Delete this product?')) return;
    const result = await supabase.from('products').delete().eq('id', id);
    if (result.error) setError(result.error.message); else await load();
  }
  return <div className="space-y-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Catalog</p><h1 className="text-4xl font-bold">Products</h1></div><button className="button-primary" onClick={() => startEdit()}>Add product</button></div><div className="flex gap-3"><input className="flex-1" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>{error && <p className="error">{error}</p>}{filtered.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <article className="product-card" key={product.id}><div className="flex justify-between gap-3"><h2 className="text-lg font-semibold">{product.name}</h2><span className="font-semibold text-teal-300">${product.price.toFixed(2)}</span></div><p className="mt-3 min-h-12 text-sm text-slate-400">{product.description || 'No description'}</p><div className="mt-5 flex gap-2"><button className="button-secondary" onClick={() => startEdit(product)}>Edit</button><button className="button-danger" onClick={() => void remove(product.id)}>Delete</button></div></article>)}</div> : <EmptyState title="No matching products" message="Try a different search or add your first product." />}{editing !== null || form.name ? <div className="modal-backdrop"><form onSubmit={submit} className="panel w-full max-w-lg space-y-4"><div className="flex justify-between"><h2 className="text-xl font-semibold">{editing ? 'Edit product' : 'New product'}</h2><button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '' }); }}>×</button></div><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label><label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label>Price<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label><button className="button-primary w-full">{editing ? 'Save changes' : 'Create product'}</button></form></div> : null}</div>;
}
