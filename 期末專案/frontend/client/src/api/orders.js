import { request } from "./http";

export function getOrders() {
  return request("/api/orders");
}

export function getOrder(id) {
  return request(`/api/orders/${id}`);
}

export function createOrder(body) {
  return request("/api/orders", { method: "POST", body: JSON.stringify(body) });
}

export function updateOrder(id, body) {
  return request(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export function deleteOrder(id) {
  return request(`/api/orders/${id}`, { method: "DELETE" });
}

