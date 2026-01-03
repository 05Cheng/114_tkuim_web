import Product from "../models/Product.js";
import { ok, created } from "../utils/response.js";

export async function createProduct(req, res) {
  const { name, price, stock, description } = req.body || {};

  if (!name || String(name).trim() === "") {
    const e = new Error("name is required");
    e.status = 400;
    throw e;
  }

  const p = await Product.create({
    name: String(name).trim(),
    price: Number(price),
    stock: Number(stock),
    description: String(description || "")
  });

  return created(res, p, "Product created");
}

export async function listProducts(req, res) {
  const items = await Product.find().sort({ createdAt: -1 });
  return ok(res, items);
}

export async function getProduct(req, res) {
  const p = await Product.findById(req.params.id);
  if (!p) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }
  return ok(res, p);
}

export async function updateProduct(req, res) {
  const p = await Product.findById(req.params.id);
  if (!p) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }

  const { name, price, stock, description } = req.body || {};
  if (name !== undefined) p.name = String(name).trim();
  if (price !== undefined) p.price = Number(price);
  if (stock !== undefined) p.stock = Number(stock);
  if (description !== undefined) p.description = String(description);

  await p.save();
  return ok(res, p, "Product updated");
}

export async function deleteProduct(req, res) {
  const p = await Product.findById(req.params.id);
  if (!p) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }
  await p.deleteOne();
  return ok(res, { id: req.params.id }, "Product deleted");
}
