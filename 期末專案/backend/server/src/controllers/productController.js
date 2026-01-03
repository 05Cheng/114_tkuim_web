import Product from "../models/Product.js";
import { ok } from "../utils/response.js";

export async function createProduct(req, res) {
  const { name, price, stock, description } = req.body;

  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ success: false, message: "name, price, stock are required", data: null });
  }

  const doc = await Product.create({
    name,
    price: Number(price),
    stock: Number(stock),
    description: description || ""
  });

  return ok(res, doc, "Product created", 201);
}

export async function getProducts(req, res) {
  const q = (req.query.q || "").trim();
  const filter = q ? { name: { $regex: q, $options: "i" } } : {};
  const list = await Product.find(filter).sort({ createdAt: -1 });
  return ok(res, list, "OK");
}

export async function getProduct(req, res) {
  const doc = await Product.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: "Product not found", data: null });
  return ok(res, doc, "OK");
}

export async function updateProduct(req, res) {
  const { name, price, stock, description } = req.body;

  const doc = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...(name !== undefined ? { name } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(stock !== undefined ? { stock: Number(stock) } : {}),
      ...(description !== undefined ? { description } : {})
    },
    { new: true, runValidators: true }
  );

  if (!doc) return res.status(404).json({ success: false, message: "Product not found", data: null });
  return ok(res, doc, "Product updated");
}

export async function deleteProduct(req, res) {
  const doc = await Product.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: "Product not found", data: null });
  return ok(res, { id: doc._id }, "Product deleted");
}
