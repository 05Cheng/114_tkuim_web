import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../api/orders.js";

function money(n) {
  return Number(n || 0).toLocaleString("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });
}

export default function AdminOrders() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await ordersApi.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "載入失敗");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function del(id) {
    if (!confirm("確定刪除訂單？")) return;
    try {
      await ordersApi.remove(id);
      await load();
    } catch (e) {
      alert(e.message || "刪除失敗");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h1">後台｜訂單管理</div>
        <div className="ml-auto flex gap-2">
          <Link className="btn" to="/admin/products">商品管理</Link>
          <Link className="btn" to="/">回前台</Link>
        </div>
      </div>

      {err ? <div className="card border-red-200 bg-red-50 text-red-700 text-sm">{err}</div> : null}

      {loading ? (
        <div className="muted">載入中...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="tableHead">
            <div className="col-span-4">客戶</div>
            <div className="col-span-2">狀態</div>
            <div className="col-span-3">金額</div>
            <div className="col-span-3 text-right">操作</div>
          </div>

          <div className="divide-y">
            {items.map(o => (
              <div key={o._id} className="tableRow">
                <div className="col-span-4">
                  <div className="font-medium">{o.customerName || "—"}</div>
                  <div className="text-xs text-slate-500">{o.phone || ""}</div>
                </div>
                <div className="col-span-2 text-sm">{o.status || "—"}</div>
                <div className="col-span-3 font-semibold">{money(o.total)}</div>
                <div className="col-span-3 flex justify-end gap-2">
                  <Link className="btn" to={`/admin/orders/${o._id}`}>明細</Link>
                  <button className="btn-danger" onClick={() => del(o._id)}>刪除</button>
                </div>
              </div>
            ))}
            {items.length === 0 ? <div className="px-4 py-6 muted">目前沒有訂單</div> : null}
          </div>
        </div>
      )}
    </div>
  );
}
