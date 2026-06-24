const API_BASE_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao comunicar com o servidor');
  }

  return data;
}

export async function registerClient(payload) {
  return request('/api/auth/register/client', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerSeller(payload) {
  return request('/api/auth/register/seller', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(identifier, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}
