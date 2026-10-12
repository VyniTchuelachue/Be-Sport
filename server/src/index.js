import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import catalog from './routes/catalog.js';
import orders from './routes/orders.js';

const app = express();
// In dev the API always sits on 4000 behind Vite's proxy, whatever PORT the shell exports.
const DEV = process.argv.includes('--dev');
const PORT = DEV ? Number(process.env.API_PORT) || 4000 : Number(process.env.PORT) || 4000;
const CLIENT_DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'client', 'dist');

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', catalog);
app.use('/api', orders);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Route API inconnue.' }));

// In production the API also serves the built React app.
if (existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST, { maxAge: '7d', index: false }));
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
}

app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Requête mal formée.' });
  console.error(err);
  res.status(500).json({ error: 'Le serveur a rencontré une erreur. Réessayez dans un instant.' });
});

app.listen(PORT, () => {
  console.log(`Be Sport API → http://localhost:${PORT}`);
});
