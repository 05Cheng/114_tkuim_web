import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../api/products.js";
import { useToast } from "../components/Toast.jsx";

export default function AdminProducts() {
  const { push } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [kw, setKw] = useState("");
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
    const q = kw.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [items, kw]);

  async function del(id) {
    if (!confirm("確定要刪除？")) return;
    try {
      await productsAPI.remove(id);
      push("已刪除", "success");
      load();
    } catch (e) {
      push(`刪除失敗：${e.message}`, "error");
    }
  }

  return (
    <div className="container-page py-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-black">後台｜商品管理</div>
          <div className="text-sm text-slate-500 mt-1">CRUD：新增、列表、編輯、刪除</div>
        </div>
        <Link className="btn-primary" to="/admin/products/new">
          新增商品
        </Link>
      </div>

      <div className="mt-4 card p-4 flex items-center gap-3">
        <input className="input max-w-md" placeholder="搜尋商品..." value={kw} onChange={(e) => setKw(e.target.value)} />
        <button className="btn-outline" onClick={load}>
          重新整理
        </button>
        <Link className="btn-outline ml-auto" to="/admin/orders">
          去訂單管理
        </Link>
      </div>

      <div className="mt-4 card p-4">
        {loading && <div className="text-slate-500">載入中...</div>}
        {!loading && err && <div className="text-red-600">載入失敗：{err}</div>}

        {!loading && !err && (
          <table className="table">
            <thead>
              <tr>
                <th>名稱</th>
                <th className="w-28">價格</th>
                <th className="w-28">庫存</th>
                <th className="w-44">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs text-slate-500 line-clamp-2">{p.description || "—"}</div>
                  </td>
                  <td>${Number(p.price || 0)}</td>
                  <td>{Number(p.stock || 0)}</td>
                  <td className="flex gap-2">
                    <Link className="btn-outline px-3 py-2" to={`/admin/products/${p._id}/edit`}>
                      編輯
                    </Link>
                    <button className="btn-danger px-3 py-2" onClick={() => del(p._id)}>
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-slate-500 py-6 text-center">
                    沒有資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
