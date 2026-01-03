import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productsApi } from "../api/products.js";
import { addToCart } from "../lib/cart.js";

function money(n) {
  return Number(n || 0).toLocaleString("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });
}

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const data = await productsApi.get(id);
        setP(data);
      } catch (e) {
        setErr(e.message || "載入失敗");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="muted">載入中...</div>;

  if (err) {
    return (
      <div className="space-y-3">
        <div className="card border-red-200 bg-red-50 text-red-700 text-sm">{err}</div>
        <Link className="btn w-fit" to="/">回商品列表</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link className="btn w-fit" to="/">← 回商品列表</Link>

      <div className="card space-y-3">
        <div className="h1">{p?.name}</div>
        <div className="text-slate-600">{p?.description || "—"}</div>

        <div className="flex items-center">
          <div className="font-semibold">{money(p?.price)}</div>
          <div className="ml-auto text-sm text-slate-500">庫存：{p?.stock ?? "—"}</div>
        </div>

        <button
          className="btn-primary w-fit"
          onClick={() => { addToCart(p, 1); alert("已加入購物車"); }}
        >
          加入購物車
        </button>
      </div>
    </div>
  );
}
