const KEY = "cart";

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeCart(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
}

export function addToCart(product, qty = 1) {
  const cart = readCart();
  const idx = cart.findIndex((x) => x.productId === product._id);
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ productId: product._id, name: product.name, price: product.price, qty });
  writeCart(cart);
  return cart;
}

export function updateQty(productId, qty) {
  const cart = readCart()
    .map((x) => (x.productId === productId ? { ...x, qty } : x))
    .filter((x) => Number(x.qty) > 0);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
}
