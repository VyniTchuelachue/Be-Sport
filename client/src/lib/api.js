import { useEffect, useState } from 'react';

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

export async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || 'Le serveur ne répond pas. Vérifiez votre connexion et réessayez.', res.status, data.fields);
  return data;
}

// Small cache so the header, footer and pages share one /store request.
const cache = new Map();

export function useApi(path) {
  const [state, setState] = useState(() =>
    cache.has(path) ? { data: cache.get(path), error: null, loading: false } : { data: null, error: null, loading: true },
  );

  useEffect(() => {
    if (!path) return;
    if (cache.has(path)) {
      setState({ data: cache.get(path), error: null, loading: false });
      return;
    }
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path)
      .then((data) => {
        cache.set(path, data);
        if (live) setState({ data, error: null, loading: false });
      })
      .catch((error) => live && setState({ data: null, error, loading: false }));
    return () => {
      live = false;
    };
  }, [path]);

  return state;
}
