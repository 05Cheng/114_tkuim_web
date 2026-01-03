import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },       // 下單當下商品名快照
    price: { type: Number, required: true, min: 0 }, // 下單當下價格快照
    qty: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "paid", "shipped", "done", "cancelled"], default: "pending" },
    note: { type: String, default: "", maxlength: 300 }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

