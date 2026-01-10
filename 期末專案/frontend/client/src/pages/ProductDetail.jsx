import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productsAPI } from "../api/products.js";
import { addToCart } from "../lib/cart.js";
import { useToast } from "../components/Toast.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { push } = useToast();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await productsAPI.get(id);
        setP(data);
      } catch (e) {
        setErr(e.message || "Load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="container-page py-6 text-slate-500">載入中...</div>;
  if (err) return <div className="container-page py-6 text-red-600">載入失敗：{err}</div>;
  if (!p) return <div className="container-page py-6 text-slate-500">找不到商品</div>;

  return (
    <div className="container-page py-6">
      <div className="card p-6">
        <Link to="/" className="text-blue-600 font-bold hover:underline">
          ← 回商品列表
        </Link>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 bg-slate-50 border-slate-100">
            <div className="text-sm text-slate-500 font-bold">商品</div>
            <div className="text-2xl font-black mt-1">{p.name}</div>
            <div className="text-blue-700 font-black text-2xl mt-3">${Number(p.price || 0)}</div>
            <div className="text-sm text-slate-500 mt-1">庫存：{Number(p.stock || 0)}</div>
          </div>

          <div>
            <div className="text-sm font-bold mb-1">描述</div>
            <div className="card p-4 text-slate-700">{p.description || "—"}</div>

            <div className="mt-4 flex items-center gap-3">
              <div className="font-bold">數量</div>
              <input
                className="input w-28"
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              />
              <button
                className="btn-primary"
                onClick={() => {
                  addToCart(p, qty);
                  push("已加入購物車", "success");
                }}
              >
                加入購物車
              </button>
              <Link className="btn-outline" to="/cart">
                去購物車
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
