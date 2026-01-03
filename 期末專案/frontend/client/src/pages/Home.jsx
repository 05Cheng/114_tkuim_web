import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products";
import { addToCart } from "../lib/cart";
import { useToast } from "../components/Toast";

export default function Home() {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await getProducts();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "載入失敗");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return items;
    return items.filter((p) => (p.name || "").toLowerCase().includes(k));
  }, [items, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">商品列表</h1>
          <p className="text-sm text-slate-500">前台瀏覽商品、加入購物車、結帳建立訂單</p>
        </div>
        <div className="flex gap-2">
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 md:w-[260px]"
            placeholder="搜尋商品..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            onClick={load}
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            重新整理
          </button>
        </div>
      </div>

      {loading && <div className="mt-6 text-sm text-slate-500">載入中...</div>}
      {err && (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {err}
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div className="mt-6 rounded-xl border bg-white p-6 text-sm text-slate-600">沒有商品</div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p._id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                <div className="mt-1 text-xs text-slate-500 line-clamp-2">{p.description || "—"}</div>
              </div>
              <div className="rounded-xl bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                ${Number(p.price || 0)}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-slate-500">庫存：{Number(p.stock ?? 0)}</div>
              <div className="flex gap-2">
                <Link
                  to={`/products/${p._id}`}
                  className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                >
                  詳情
                </Link>
                <button
                  onClick={() => {
                    addToCart(p, 1);
                    toast.success("已加入購物車");
                  }}
                  className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  加入
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border bg-white p-5 text-sm text-slate-600">
        後台入口：<Link className="font-semibold text-slate-900 underline" to="/admin/products">/admin/products</Link>
      </div>
    </div>
  );
}
