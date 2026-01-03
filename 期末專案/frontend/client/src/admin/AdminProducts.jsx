import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../api/products.js";

function money(n) {
  return Number(n || 0).toLocaleString("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });
}

export default function AdminProducts() {
  const [items, setItems] = useState([]);
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

  async function del(id) {
    if (!confirm("確定要刪除商品？")) return;
    try {
      await productsApi.remove(id);
      await load();
    } catch (e) {
      alert(e.message || "刪除失敗");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h1">後台｜商品管理</div>
        <div className="ml-auto flex gap-2">
          <Link className="btn" to="/admin/orders">訂單管理</Link>
          <Link className="btn-primary" to="/admin/products/new">新增商品</Link>
        </div>
      </div>

      {err ? <div className="card border-red-200 bg-red-50 text-red-700 text-sm">{err}</div> : null}

      {loading ? (
        <div className="muted">載入中...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="tableHead">
            <div className="col-span-5">名稱</div>
            <div className="col-span-2">價格</div>
            <div className="col-span-2">庫存</div>
            <div className="col-span-3 text-right">操作</div>
          </div>

          <div className="divide-y">
            {items.map(p => (
              <div key={p._id} className="tableRow">
                <div className="col-span-5 font-medium truncate">{p.name}</div>
                <div className="col-span-2">{money(p.price)}</div>
                <div className="col-span-2">{p.stock ?? "—"}</div>
                <div className="col-span-3 flex justify-end gap-2">
                  <Link className="btn" to={`/admin/products/${p._id}`}>編輯</Link>
                  <button className="btn-danger" onClick={() => del(p._id)}>刪除</button>
                </div>
              </div>
            ))}
            {items.length === 0 ? <div className="px-4 py-6 muted">目前沒有商品</div> : null}
          </div>
        </div>
      )}
    </div>
  );
}
