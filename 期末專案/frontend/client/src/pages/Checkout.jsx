import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import { calcTotal, clearCart, getCartItems } from "../lib/cart";
import { useToast } from "../components/Toast";

export default function Checkout() {
  const toast = useToast();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const total = calcTotal(items);

  async function submit() {
    if (items.length === 0) return toast.error("購物車是空的");
    if (!customerName.trim()) return toast.error("請輸入姓名");
    if (!customerPhone.trim()) return toast.error("請輸入電話");
    if (!customerAddress.trim()) return toast.error("請輸入地址");

    setSubmitting(true);
    try {
      const body = {
        customer: { name: customerName.trim(), phone: customerPhone.trim(), address: customerAddress.trim() },
        items: items.map((x) => ({ productId: x.productId, name: x.name, price: x.price, qty: x.qty })),
        total,
        status: "pending",
      };
      await createOrder(body);
      clearCart();
      toast.success("訂單已建立！");
      nav("/admin/orders");
    } catch (e) {
      toast.error(e.message || "建立訂單失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">結帳</h1>
          <p className="text-sm text-slate-500">送出後會建立一筆訂單（後台可查看）</p>
        </div>
        <Link className="text-sm text-slate-700 hover:underline" to="/cart">← 回購物車</Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">姓名</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">電話</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">地址</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
            </div>
          </div>

          <button
            disabled={submitting}
            onClick={submit}
            className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "送出中..." : `送出訂單 ($${total})`}
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">訂單內容</div>
          <div className="mt-3 space-y-2 text-sm">
            {items.map((x) => (
              <div key={x.productId} className="flex justify-between">
                <span className="text-slate-700">{x.name} × {x.qty}</span>
                <span className="font-semibold">${Number(x.price) * Number(x.qty)}</span>
              </div>
            ))}
            <div className="mt-3 flex justify-between border-t pt-3">
              <span className="text-slate-600">總金額</span>
              <span className="font-bold text-slate-900">${total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
