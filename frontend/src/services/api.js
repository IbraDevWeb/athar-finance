// Single configuration point for all backend requests.
const configuredUrl = import.meta.env.VITE_API_URL;
export const API_URL = (configuredUrl || (import.meta.env.DEV ? '/api' : 'https://athar-api.onrender.com/api')).replace(/\/+$/, '');

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path.startsWith('/') ? path : '/' + path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  let body;
  try { body = await response.json(); }
  catch { throw new Error('Réponse invalide du serveur.'); }
  if (!response.ok) {
    throw new Error(body.error || body.message || `Erreur HTTP ${response.status}`);
  }
  return body;
}

export const screeningService = {
  checkHalal: ticker => apiRequest('/screening/analyze', {
    method: 'POST',
    body: JSON.stringify({ tickers: ticker }),
  }),
  scanEtf: ticker => apiRequest('/screening/etf-scan', {
    method: 'POST',
    body: JSON.stringify({ ticker }),
  }),
};
export default apiRequest;
