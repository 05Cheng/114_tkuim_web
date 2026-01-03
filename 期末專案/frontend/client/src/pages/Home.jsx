import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../api/products.js";
import { addToCart } from "../lib/cart.js";

function money(n) {
  return Number(n || 0).toLocaleString("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await productsApi.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "載入失敗");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(p => String(p.name || "").toLowerCase().includes(s));
  }, [items, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="h1">商品列表</div>
        <div className="sm:ml-auto flex gap-2">
          <input className="input sm:w-72" value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜尋商品..." />
          <button className="btn" onClick={load}>重新整理</button>
        </div>
      </div>

      {err ? <div className="card border-red-200 bg-red-50 text-red-700 text-sm">{err}</div> : null}

      {loading ? (
        <div className="muted">載入中...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(p => (
            <div key={p._id} className="card space-y-3">
              <div className="space-y-1">
                <Link to={`/products/${p._id}`} className="font-semibold hover:underline">{p.name}</Link>
                <div className="text-sm text-slate-600 line-clamp-2">{p.description || "—"}</div>
              </div>
              <div className="flex items-center">
                <div className="font-semibold">{money(p.price)}</div>
                <div className="ml-auto text-xs text-slate-500">庫存：{p.stock ?? "—"}</div>
              </div>
              <div className="flex gap-2">
                <Link className="btn flex-1 text-center" to={`/products/${p._id}`}>查看</Link>
                <button
                  className="btn-primary flex-1"
                  onClick={() => { addToCart(p, 1); alert("已加入購物車"); }}
                >
                  加入購物車
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 ? <div className="muted">沒有符合的商品</div> : null}
        </div>
      )}
    </div>
  );
}
