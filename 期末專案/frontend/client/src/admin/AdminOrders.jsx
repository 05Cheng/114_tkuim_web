import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteOrder, getOrders } from "../api/orders";
import { useToast } from "../components/Toast";

export default function AdminOrders() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getOrders();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message || "載入失敗");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    if (!confirm("確定要刪除這筆訂單？")) return;
    try {
      await deleteOrder(id);
      toast.success("已刪除訂單");
      load();
    } catch (e) {
      toast.error(e.message || "刪除失敗");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">後台｜訂單管理</h1>
          <p className="text-sm text-slate-500">Read / Update(狀態) / Delete</p>
          <div className="mt-2 flex gap-2 text-sm">
            <Link to="/admin/products" className="text-slate-700 underline">去商品管理</Link>
            <Link to="/" className="text-slate-700 underline">回前台</Link>
          </div>
        </div>
        <button onClick={load} className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
          重新整理
        </button>
      </div>

      <div className="mt-6 rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">客戶</th>
                <th className="p-3">狀態</th>
                <th className="p-3">總金額</th>
                <th className="p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-4 text-slate-500" colSpan="4">載入中...</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="p-4 text-slate-500" colSpan="4">沒有訂單</td></tr>
              ) : (
                items.map((o) => (
                  <tr key={o._id} className="border-b last:border-b-0">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{o.customer?.name || "—"}</div>
                      <div className="text-xs text-slate-500">{o.customer?.phone || ""}</div>
                    </td>
                    <td className="p-3">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
                        {o.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3">${Number(o.total || 0)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/admin/orders/${o._id}`}
                          className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          詳情
                        </Link>
                        <button
                          onClick={() => onDelete(o._id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

