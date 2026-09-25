const BASE = '/api';

function getKey() {
  return sessionStorage.getItem('sbv_admin_key') || '';
}

async function request(method, path, body, isFormData = false) {
  const headers = { 'x-api-key': getKey() };
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get:    (path)                => request('GET',    path),
  post:   (path, body, isForm) => request('POST',   path, body, isForm),
  patch:  (path, body, isForm) => request('PATCH',  path, body, isForm),
  delete: (path)               => request('DELETE', path),
};
