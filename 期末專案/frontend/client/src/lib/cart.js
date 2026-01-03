const KEY = "shoplite_cart_v1";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getCartItems() {
  return read();
}

export function addToCart(product, qty = 1) {
  const items = read();
  const idx = items.findIndex((x) => x.productId === product._id);
  if (idx >= 0) items[idx].qty += qty;
  else {
    items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      qty,
    });
  }
  write(items);
  return items;
}

export function updateQty(productId, qty) {
  const items = read();
  const idx = items.findIndex((x) => x.productId === productId);
  if (idx >= 0) items[idx].qty = Math.max(1, Number(qty) || 1);
  write(items);
  return items;
}

export function removeItem(productId) {
  const items = read().filter((x) => x.productId !== productId);
  write(items);
  return items;
}

export function clearCart() {
  write([]);
  return [];
}

export function calcTotal(items) {
  return items.reduce((sum, x) => sum + Number(x.price || 0) * Number(x.qty || 0), 0);
}

