import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, updateOrder } from "../api/orders";
import { useToast } from "../components/Toast";

const STATUSES = ["pending", "paid", "shipped", "done", "cancelled"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (e) {
      toast.error(e.message || "載入失敗");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function setStatus(status) {
    setSaving(true);
    try {
      const updated = await updateOrder(id, { status });
      setOrder(updated);
      toast.success("狀態已更新");
    } catch (e) {
      toast.error(e.message || "更新失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">訂單詳情</h1>
          <p className="text-sm text-slate-500">查看訂單內容、更新狀態</p>
        </div>
        <Link className="text-sm text-slate-700 hover:underline" to="/admin/orders">← 回訂單列表</Link>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        {loading ? (
          <div className="text-sm text-slate-500">載入中...</div>
        ) : !order ? (
          <div className="text-sm text-slate-500">找不到訂單</div>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="text-xs text-slate-500">客戶</div>
                <div className="mt-1 font-semibold text-slate-900">{order.customer?.name || "—"}</div>
                <div className="text-sm text-slate-600">{order.customer?.phone || ""}</div>
                <div className="text-sm text-slate-600">{order.customer?.address || ""}</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-xs text-slate-500">總金額</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">${Number(order.total || 0)}</div>

                <div className="mt-3 text-xs text-slate-500">狀態</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      disabled={saving}
                      onClick={() => setStatus(s)}
                      className={[
                        "rounded-lg px-3 py-2 text-xs font-semibold border",
                        order.status === s ? "bg-slate-900 text-white border-slate-900" : "hover:bg-slate-50",
                        saving && "opacity-60",
                      ].join(" ")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border">
              <div className="border-b bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">商品清單</div>
              <div className="p-4 space-y-2 text-sm">
                {(order.items || []).map((x, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-slate-700">{x.name} × {x.qty}</span>
                    <span className="font-semibold">${Number(x.price || 0) * Number(x.qty || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

