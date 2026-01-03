const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  const res = await fetch(url, { ...options, headers });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const msg = payload?.message || payload?.error || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  // 支援你的後端統一格式：{ success, message, data }
  return payload?.data !== undefined ? payload.data : payload;
}

