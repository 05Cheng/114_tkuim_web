import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getProducts } from "../api/products";
import { useToast } from "../components/Toast";

export default function AdminProducts() {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getProducts();
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

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return items;
    return items.filter((p) => (p.name || "").toLowerCase().includes(k));
  }, [items, q]);

  async function onDelete(id) {
    if (!confirm("確定要刪除這個商品？")) return;
    try {
      await deleteProduct(id);
      toast.success("已刪除");
      load();
    } catch (e) {
      toast.error(e.message || "刪除失敗");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">後台｜商品管理</h1>
          <p className="text-sm text-slate-500">CRUD：新增、列表、編輯、刪除</p>
          <div className="mt-2 flex gap-2 text-sm">
            <Link to="/admin/orders" className="text-slate-700 underline">去訂單管理</Link>
            <Link to="/" className="text-slate-700 underline">回前台</Link>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 md:w-[260px]"
            placeholder="搜尋商品..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Link
            to="/admin/products/new"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            新增商品
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">名稱</th>
                <th className="p-3">價格</th>
                <th className="p-3">庫存</th>
                <th className="p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-4 text-slate-500" colSpan="4">載入中...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="p-4 text-slate-500" colSpan="4">沒有資料</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="border-b last:border-b-0">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{p.description || "—"}</div>
                    </td>
                    <td className="p-3">${Number(p.price || 0)}</td>
                    <td className="p-3">{Number(p.stock ?? 0)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          編輯
                        </Link>
                        <button
                          onClick={() => onDelete(p._id)}
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

