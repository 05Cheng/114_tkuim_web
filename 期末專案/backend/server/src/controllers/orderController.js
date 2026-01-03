import Order from "../models/Order.js";
import { ok, created } from "../utils/response.js";

export async function createOrder(req, res) {
  const { customerName, phone, address, items, total, status } = req.body || {};

  if (!customerName || !phone || !address) {
    const e = new Error("customerName / phone / address are required");
    e.status = 400;
    throw e;
  }
  if (!Array.isArray(items) || items.length === 0) {
    const e = new Error("items is required");
    e.status = 400;
    throw e;
  }

  const order = await Order.create({
    customerName: String(customerName).trim(),
    phone: String(phone).trim(),
    address: String(address).trim(),
    status: status || "pending",
    items: items.map((x) => ({
      productId: x.productId || undefined,
      name: String(x.name || ""),
      price: Number(x.price || 0),
      qty: Number(x.qty || 1)
    })),
    total: Number(total || 0)
  });

  return created(res, order, "Order created");
}

export async function listOrders(req, res) {
  const items = await Order.find().sort({ createdAt: -1 });
  return ok(res, items);
}

export async function getOrder(req, res) {
  const o = await Order.findById(req.params.id);
  if (!o) {
    const e = new Error("Order not found");
    e.status = 404;
    throw e;
  }
  return ok(res, o);
}

export async function updateOrder(req, res) {
  const o = await Order.findById(req.params.id);
  if (!o) {
    const e = new Error("Order not found");
    e.status = 404;
    throw e;
  }

  const { status, customerName, phone, address, items, total } = req.body || {};

  if (status !== undefined) o.status = status;
  if (customerName !== undefined) o.customerName = String(customerName).trim();
  if (phone !== undefined) o.phone = String(phone).trim();
  if (address !== undefined) o.address = String(address).trim();
  if (Array.isArray(items)) o.items = items;
  if (total !== undefined) o.total = Number(total);

  await o.save();
  return ok(res, o, "Order updated");
}

export async function deleteOrder(req, res) {
  const o = await Order.findById(req.params.id);
  if (!o) {
    const e = new Error("Order not found");
    e.status = 404;
    throw e;
  }
  await o.deleteOne();
  return ok(res, { id: req.params.id }, "Order deleted");
}
