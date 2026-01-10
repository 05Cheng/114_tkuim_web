import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ordersAPI } from "../api/orders.js";

function badge(status) {
  const s = (status || "pending").toLowerCase();
  if (s === "paid") return "badge-green";
  if (s === "shipped") return "badge-blue";
  if (s === "cancelled") return "badge-red";
  return "badge-yellow";
}

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [kw, setKw] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await ordersAPI.list();
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
    return items.filter((o) => (o._id || "").toLowerCase().includes(q) || (o.customer?.name || "").toLowerCase().includes(q));
  }, [items, kw]);

  return (
    <div className="container-page py-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-black">後台｜訂單管理</div>
          <div className="text-sm text-slate-500 mt-1">查看訂單、進入詳情、更新狀態</div>
        </div>
        <Link className="btn-outline" to="/admin/products">
          回商品管理
        </Link>
      </div>

      <div className="mt-4 card p-4 flex items-center gap-3">
        <input className="input max-w-md" placeholder="搜尋（訂單ID/姓名）" value={kw} onChange={(e) => setKw(e.target.value)} />
        <button className="btn-outline" onClick={load}>
          重新整理
        </button>
      </div>

      <div className="mt-4 card p-4">
        {loading && <div className="text-slate-500">載入中...</div>}
        {!loading && err && <div className="text-red-600">載入失敗：{err}</div>}

        {!loading && !err && (
          <table className="table">
            <thead>
              <tr>
                <th>訂單ID</th>
                <th>姓名</th>
                <th className="w-28">金額</th>
                <th className="w-28">狀態</th>
                <th className="w-28">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id}>
                  <td className="font-mono text-xs">{o._id}</td>
                  <td className="font-bold">{o.customer?.name || "—"}</td>
                  <td>${Number(o.total || 0)}</td>
                  <td>
                    <span className={badge(o.status)}>{o.status || "pending"}</span>
                  </td>
                  <td>
                    <Link className="btn-outline px-3 py-2" to={`/admin/orders/${o._id}`}>
                      查看
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-slate-500 py-6 text-center">
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


