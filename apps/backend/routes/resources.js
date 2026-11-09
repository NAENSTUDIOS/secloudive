import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import rateLimit from 'express-rate-limit';
import { data } from '../data/loader.js';
import { adminOnly, signedIn } from '../middleware/auth.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const file = (name) => path.join(root, '..', 'data', 'resources', name);
const readJson = async (name, fallback) => { try { return JSON.parse(await fs.readFile(file(name), 'utf8')); } catch { return fallback; } };
const writeJson = (name, value) => fs.writeFile(file(name), `${JSON.stringify(value, null, 2)}\n`);
const discoverLimit = rateLimit({ windowMs: 10 * 60 * 1000, limit: 1, standardHeaders: true, legacyHeaders: false });
export const resources = Router();
resources.get('/', signedIn, async (_req, res) => res.json(await readJson('resources.json', data.resources)));
resources.get('/pending', adminOnly, async (_req, res) => res.json(await readJson('pending.json', data.pending)));
resources.post('/discover', adminOnly, discoverLimit, async (req, res, next) => {
  try {
    const url = process.env.LLM_URL || 'https://api.groq.com/openai/v1/chat/completions';
    const apiKey = process.env.LLM_API_KEY || (process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : '');
    if (!apiKey) return res.status(503).json({ error: 'LLM_API_KEY or GEMINI_API_KEY is not configured' });
    const topics = data.paths.map((item) => item.title).join(', ');
    const trusted = data.trustedSources.join(', ');
    const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model: process.env.LLM_MODEL || 'llama-3.3-70b-versatile', response_format: { type: 'json_object' }, messages: [{ role: 'user', content: `Return JSON object {"resources":[]} with title,url,provider,track,level,type,isFree,summary,confidence for trusted domains only. Topics: ${topics}. Trusted domains: ${trusted}.` }] }) });
    if (!response.ok) return res.status(502).json({ error: 'LLM provider failed' });
    const body = await response.json(); const parsed = JSON.parse(body.choices?.[0]?.message?.content || '{}'); const existing = [...await readJson('resources.json', []), ...await readJson('pending.json', [])].map((item) => item.url);
    const trustedDomains = new Set(data.trustedSources);
    const valid = (parsed.resources ?? []).filter((item) => { try { const parsedUrl = new URL(item.url); return typeof item.title === 'string' && trustedDomains.has(parsedUrl.hostname) && !existing.includes(item.url) && typeof item.confidence === 'number'; } catch { return false; } }).slice(0, 20).map((item) => ({ ...item, status: 'pending', sourceUrl: item.url, discoveredAt: new Date().toISOString() }));
    const pending = await readJson('pending.json', []); await writeJson('pending.json', [...pending, ...valid]); return res.json({ added: valid.length });
  } catch (error) { next(error); }
});
resources.post('/:id/approve', adminOnly, async (req, res, next) => { try { const pending = await readJson('pending.json', []); const item = pending.find((entry) => entry.id === req.params.id || entry.url === req.params.id); if (!item) return res.status(404).json({ error: 'resource not found' }); await writeJson('pending.json', pending.filter((entry) => entry !== item)); const approved = await readJson('resources.json', []); await writeJson('resources.json', [...approved, item]); return res.json({ ok: true }); } catch (error) { next(error); } });
resources.post('/:id/reject', adminOnly, async (req, res, next) => { try { const pending = await readJson('pending.json', []); const item = pending.find((entry) => entry.id === req.params.id || entry.url === req.params.id); if (!item) return res.status(404).json({ error: 'resource not found' }); await writeJson('pending.json', pending.filter((entry) => entry !== item)); const rejected = await readJson('rejected.json', []); await writeJson('rejected.json', [...rejected, { ...item, rejectedAt: new Date().toISOString() }]); return res.json({ ok: true }); } catch (error) { next(error); } });
