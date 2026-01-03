import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/products";
import { addToCart } from "../lib/cart";
import { useToast } from "../components/Toast";

export default function ProductDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await getProduct(id);
        setP(data);
      } catch (e) {
        setErr(e.message || "載入失敗");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <Link className="text-sm text-slate-700 hover:underline" to="/">← 回商品列表</Link>
        <Link className="text-sm text-slate-700 hover:underline" to="/cart">購物車</Link>
      </div>

      {loading && <div className="mt-6 text-sm text-slate-500">載入中...</div>}
      {err && <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{err}</div>}

      {!loading && !err && p && (
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{p.name}</h1>
              <div className="mt-2 text-sm text-slate-600">{p.description || "—"}</div>
              <div className="mt-3 text-sm text-slate-500">庫存：{Number(p.stock ?? 0)}</div>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white">
              <div className="text-xs text-white/80">價格</div>
              <div className="text-2xl font-bold">${Number(p.price || 0)}</div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                addToCart(p, 1);
                toast.success("已加入購物車");
              }}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              加入購物車
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
