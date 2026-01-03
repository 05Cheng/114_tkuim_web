import { request } from "./http";

export function getProducts() {
  return request("/api/products");
}

export function getProduct(id) {
  return request(`/api/products/${id}`);
}

export function createProduct(body) {
  return request("/api/products", { method: "POST", body: JSON.stringify(body) });
}

export function updateProduct(id, body) {
  return request(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export function deleteProduct(id) {
  return request(`/api/products/${id}`, { method: "DELETE" });
}

