import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { ok } from "../utils/response.js";

function calcTotal(items) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

export async function createOrder(req, res) {
  const { items, note } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "items is required", data: null });
  }

  // items: [{ productId, qty }]
  const ids = items.map((x) => x.productId);
  const products = await Product.find({ _id: { $in: ids } });

  if (products.length !== ids.length) {
    return res.status(400).json({ success: false, message: "Some products not found", data: null });
  }

  // 建立快照 items + 可選擇扣庫存（這裡先做扣庫存）
  const snapItems = items.map((it) => {
    const p = products.find((x) => String(x._id) === String(it.productId));
    const qty = Number(it.qty || 1);

    return {
      productId: p._id,
      name: p.name,
      price: p.price,
      qty
    };
  });

  // 檢查庫存
  for (const it of snapItems) {
    const p = products.find((x) => String(x._id) === String(it.productId));
    if (p.stock < it.qty) {
      return res.status(400).json({ success: false, message: `Stock not enough: ${p.name}`, data: null });
    }
  }

  // 扣庫存
  for (const it of snapItems) {
    await Product.updateOne({ _id: it.productId }, { $inc: { stock: -it.qty } });
  }

  const total = calcTotal(snapItems);

  const doc = await Order.create({
    items: snapItems,
    total,
    status: "pending",
    note: note || ""
  });

  return ok(res, doc, "Order created", 201);
}

export async function getOrders(req, res) {
  const list = await Order.find().sort({ createdAt: -1 });
  return ok(res, list, "OK");
}

export async function getOrder(req, res) {
  const doc = await Order.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: "Order not found", data: null });
  return ok(res, doc, "OK");
}

export async function updateOrder(req, res) {
  const { status, note } = req.body;

  const doc = await Order.findByIdAndUpdate(
    req.params.id,
    {
      ...(status !== undefined ? { status } : {}),
      ...(note !== undefined ? { note } : {})
    },
    { new: true, runValidators: true }
  );

  if (!doc) return res.status(404).json({ success: false, message: "Order not found", data: null });
  return ok(res, doc, "Order updated");
}

export async function deleteOrder(req, res) {
  const doc = await Order.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: "Order not found", data: null });

  // 退庫存（可選；這裡做退回）
  for (const it of doc.items) {
    await Product.updateOne({ _id: it.productId }, { $inc: { stock: it.qty } });
  }

  return ok(res, { id: doc._id }, "Order deleted");
}

