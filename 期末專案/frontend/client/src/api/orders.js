import { request } from "./http.js";

export const ordersApi = {
  list: () => request("/api/orders"),
  get: (id) => request(`/api/orders/${id}`),
  create: (payload) => request("/api/orders", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/orders/${id}`, { method: "DELETE" })
};
