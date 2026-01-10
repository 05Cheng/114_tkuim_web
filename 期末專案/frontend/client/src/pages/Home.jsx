import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { productsAPI } from "../api/products.js";
import { addToCart } from "../lib/cart.js";
import { useToast } from "../components/Toast.jsx";

export default function Home() {
  const { push } = useToast();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim().toLowerCase();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await productsAPI.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [items, q]);

  return (
    <div className="container-page py-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-black">商品列表</div>
          <div className="text-sm text-slate-500 mt-1">瀏覽商品、加入購物車、前往結帳建立訂單</div>
        </div>
        <button className="btn-outline" onClick={load}>
          重新整理
        </button>
      </div>

      <div className="mt-5">
        {loading && <div className="text-slate-500">載入中...</div>}
        {!loading && err && (
          <div className="card p-4 border-red-200">
            <div className="font-bold text-red-600">載入失敗</div>
            <div className="text-sm text-slate-600 mt-1">{err}</div>
          </div>
        )}

        {!loading && !err && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <div key={p._id} className="card p-4 flex flex-col">
                <div className="font-black line-clamp-2 min-h-[44px]">{p.name}</div>
                <div className="mt-2 text-blue-700 font-black text-lg">${Number(p.price || 0)}</div>
                <div className="text-xs text-slate-500 mt-1">庫存：{Number(p.stock || 0)}</div>

                <div className="mt-3 text-sm text-slate-600 line-clamp-3 min-h-[60px]">{p.description || "—"}</div>

                <div className="mt-auto pt-4 flex gap-2">
                  <Link className="btn-outline flex-1" to={`/product/${p._id}`}>
                    查看
                  </Link>
                  <button
                    className="btn-primary flex-1"
                    onClick={() => {
                      addToCart(p, 1);
                      push("已加入購物車", "success");
                    }}
                  >
                    加入
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-slate-500">沒有商品</div>}
          </div>
        )}
      </div>
    </div>
  );
}

