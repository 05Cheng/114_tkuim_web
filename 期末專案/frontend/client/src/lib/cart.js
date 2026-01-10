const KEY = "shoplite_cart_v1";

export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(product, qty = 1) {
  const cart = loadCart();
  const idx = cart.findIndex((x) => x.productId === product._id);
  if (idx >= 0) cart[idx].qty += qty;
  else
    cart.push({
      productId: product._id,
      name: product.name,
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
      description: product.description || "",
      qty
    });
  saveCart(cart);
  return cart;
}

export function updateQty(productId, qty) {
  const cart = loadCart().map((x) => (x.productId === productId ? { ...x, qty } : x));
  const filtered = cart.filter((x) => x.qty > 0);
  saveCart(filtered);
  return filtered;
}

export function removeItem(productId) {
  const cart = loadCart().filter((x) => x.productId !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCount() {
  return loadCart().reduce((sum, x) => sum + x.qty, 0);
}

export function getTotal() {
  return loadCart().reduce((sum, x) => sum + x.qty * x.price, 0);
}


