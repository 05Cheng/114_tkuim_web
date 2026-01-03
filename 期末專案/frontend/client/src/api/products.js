import { request } from "./http.js";

export const productsApi = {
  list: () => request("/api/products"),
  get: (id) => request(`/api/products/${id}`),
  create: (payload) => request("/api/products", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/products/${id}`, { method: "DELETE" })
};
