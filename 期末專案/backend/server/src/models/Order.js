import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "done", "cancelled"],
      default: "pending"
    },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
