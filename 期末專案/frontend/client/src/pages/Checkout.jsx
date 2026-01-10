import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadCart, clearCart, getTotal } from "../lib/cart.js";
import { ordersAPI } from "../api/orders.js";
import { useToast } from "../components/Toast.jsx";

export default function Checkout() {
  const nav = useNavigate();
  const { push } = useToast();

  const items = useMemo(() => loadCart(), []);
  const total = getTotal();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (items.length === 0) {
      push("購物車是空的", "error");
      return;
    }

    const payload = {
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim()
      },
      items: items.map((x) => ({
        productId: x.productId,
        name: x.name,
        price: x.price,
        qty: x.qty
      })),
      total
    };

    setLoading(true);
    try {
      await ordersAPI.create(payload);
      clearCart();
      push("訂單建立成功", "success");
      nav("/");
    } catch (e2) {
      push(`建立失敗：${e2.message || "error"}`, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-6">
      <div className="text-2xl font-black">結帳</div>
      <div className="text-sm text-slate-500 mt-1">填寫資料並建立訂單</div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="font-black text-lg">收件資訊</div>
          <form className="mt-4 space-y-4" onSubmit={submit}>
            <div>
              <div className="text-sm font-bold mb-1">姓名</div>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <div className="text-sm font-bold mb-1">電話</div>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <div className="text-sm font-bold mb-1">地址</div>
              <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            <div className="flex gap-3">
              <button disabled={loading} className="btn-primary">
                {loading ? "送出中..." : "送出訂單"}
              </button>
              <Link className="btn-outline" to="/cart">
                回購物車
              </Link>
            </div>
          </form>
        </div>

        <div className="card p-6">
          <div className="font-black text-lg">訂單摘要</div>
          <div className="mt-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-slate-500">購物車是空的</div>
            ) : (
              items.map((x) => (
                <div key={x.productId} className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{x.name}</div>
                    <div className="text-xs text-slate-500">
                      ${x.price} × {x.qty}
                    </div>
                  </div>
                  <div className="font-black">${x.price * x.qty}</div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-slate-600">總計</div>
            <div className="text-2xl font-black text-blue-700">${total}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

