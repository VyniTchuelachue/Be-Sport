import { readFile, writeFile, rename } from 'node:fs/promises';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const file = (name) => path.join(DATA_DIR, name);

/*
 * Catalogue files (products, store, promotions) are edited by hand.
 * Each one is re-read only when its modification time changes, so an
 * edit shows up on the next request without restarting the server.
 */
const cache = new Map();
function live(name, fallback) {
  const mtime = statSync(file(name), { throwIfNoEntry: false })?.mtimeMs;
  if (!mtime) return fallback;
  const hit = cache.get(name);
  if (hit?.mtime === mtime) return hit.data;
  try {
    const data = JSON.parse(readFileSync(file(name), 'utf8'));
    cache.set(name, { mtime, data });
    return data;
  } catch (err) {
    // A half-saved or invalid file must not take the shop down: keep serving the last good copy.
    console.error(`[data] ${name} est illisible (${err.message}). Dernière version valide conservée.`);
    return hit?.data ?? fallback;
  }
}

export const getProducts = () => live('products.json', []);
export const getStore = () => live('store.json', {});
export const getPromotions = () => live('promotions.json', []);
export const findProduct = (slug) => getProducts().find((p) => p.slug === slug);

async function readJson(name, fallback) {
  if (!existsSync(file(name))) return fallback;
  return JSON.parse(await readFile(file(name), 'utf8'));
}

// Writes go through a temp file + rename so a crash never leaves half-written JSON.
async function writeJson(name, data) {
  const tmp = `${file(name)}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2));
  await rename(tmp, file(name));
}

// Appends are serialised so two simultaneous orders can't overwrite each other.
let queue = Promise.resolve();
export function append(name, record) {
  const job = queue.then(async () => {
    const list = await readJson(name, []);
    list.push(record);
    await writeJson(name, list);
  });
  // Keep the chain alive even if this write fails; the caller still sees the error.
  queue = job.catch(() => {});
  return job;
}

export function readList(name) {
  return readJson(name, []);
}
