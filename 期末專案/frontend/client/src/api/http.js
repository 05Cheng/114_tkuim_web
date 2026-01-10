const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  // 你的後端回傳格式：{ success, message, data }
  if (data && typeof data === "object" && "data" in data) return data.data;
  return data;
}

