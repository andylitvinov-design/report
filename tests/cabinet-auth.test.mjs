import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const auth = await readFile(new URL('../src/lib/auth.js', import.meta.url), 'utf8');
const repo = await readFile(new URL('../src/lib/clientRepository.js', import.meta.url), 'utf8');
const history = await readFile(new URL('../src/pages/DynamicsHistory.jsx', import.meta.url), 'utf8');
const schema = await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8');

test('cabinet routes are protected and login preserves next path', () => {
  assert.match(app, /function isProtectedPath/);
  assert.match(app, /pathname\.startsWith\("\/cabinet"\)/);
  assert.match(app, /\/login\?next=/);
  assert.match(app, /Войти через Google/);
});

test('google auth supports supabase and dev fallback', () => {
  assert.match(auth, /VITE_SUPABASE_URL/);
  assert.match(auth, /VITE_SUPABASE_ANON_KEY/);
  assert.match(auth, /provider", "google"/);
  assert.match(auth, /createDevSession/);
});

test('history is scoped to the current user', () => {
  assert.match(repo, /getUserStorageKey\(user\.id\)/);
  assert.match(repo, /filter\(\(item\) => item\.userId === user\.id\)/);
  assert.match(history, /listAnalysisRunsForUser\(user\)/);
});

test('database schema covers client cabinet history tables', () => {
  for (const table of ['cabinet_users', 'client_profiles', 'analysis_runs', 'analysis_answers', 'reports', 'recommendations']) {
    assert.match(schema, new RegExp(`create table if not exists public\\.${table}`));
  }
});
