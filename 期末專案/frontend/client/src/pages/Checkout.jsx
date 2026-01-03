import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { readCart, clearCart } from "../lib/cart.js";
import { ordersApi } from "../api/orders.js";

function money(n) {
  return Number(n || 0).toLocaleString("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });
}

export default function Checkout() {
  const nav = useNavigate();
  const [cart] = useState(readCart());
  const total = useMemo(
    () => cart.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 0), 0),
    [cart]
  );

  const [form, setForm] = useState({ customerName: "", phone: "", address: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="card text-sm">
        購物車是空的。<Link className="underline" to="/">回商品列表</Link>
      </div>
    );
  }

  async function submit() {
    setErr("");
    setBusy(true);
    try {
      const payload = {
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        items: cart.map(x => ({ productId: x.productId, name: x.name, price: x.price, qty: x.qty })),
        total,
        status: "pending"
      };

      if (!payload.customerName || !payload.phone || !payload.address) throw new Error("請填寫姓名、電話、地址");

      const created = await ordersApi.create(payload);
      clearCart();
      alert("訂單建立成功");
      const oid = created?._id || created?.id;
      if (oid) nav(`/admin/orders/${oid}`);
      else nav("/admin/orders");
    } catch (e) {
      setErr(e.message || "送出失敗");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="h1">結帳</div>

      {err ? <div className="card border-red-200 bg-red-50 text-red-700 text-sm">{err}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card space-y-4">
          <div className="space-y-1">
            <div className="label">收件人姓名</div>
            <input className="input" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          </div>

          <div className="space-y-1">
            <div className="label">電話</div>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div className="space-y-1">
            <div className="label">地址</div>
            <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>

          <button className="btn-primary" disabled={busy} onClick={submit}>
            {busy ? "送出中..." : "送出訂單"}
          </button>

          <Link className="btn w-fit" to="/cart">← 回購物車</Link>
        </div>

        <div className="card space-y-3">
          <div className="font-semibold">訂單明細</div>
          <div className="divide-y">
            {cart.map(it => (
              <div key={it.productId} className="py-2 flex items-center">
                <div className="min-w-0">
                  <div className="truncate">{it.name}</div>
                  <div className="text-xs text-slate-500">{money(it.price)} × {it.qty}</div>
                </div>
                <div className="ml-auto font-semibold">{money(Number(it.price) * Number(it.qty))}</div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t flex items-center">
            <div className="text-sm text-slate-600">合計</div>
            <div className="ml-auto font-semibold">{money(total)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
