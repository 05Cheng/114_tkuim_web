import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ordersApi } from "../api/orders.js";

function money(n) {
  return Number(n || 0).toLocaleString("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [o, setO] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const data = await ordersApi.get(id);
        setO(data);
      } catch (e) {
        setErr(e.message || "載入失敗");
      }
    })();
  }, [id]);

  async function setStatus(status) {
    if (!o) return;
    setBusy(true);
    try {
      const updated = await ordersApi.update(id, { status });
      setO(updated);
    } catch (e) {
      alert(e.message || "更新失敗");
    } finally {
      setBusy(false);
    }
  }

  if (err) {
    return (
      <div className="space-y-3">
        <div className="card border-red-200 bg-red-50 text-red-700 text-sm">{err}</div>
        <Link className="btn w-fit" to="/admin/orders">回訂單列表</Link>
      </div>
    );
  }

  if (!o) return <div className="muted">載入中...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h1">後台｜訂單明細</div>
        <div className="ml-auto flex gap-2">
          <button className="btn" onClick={() => nav(-1)}>返回</button>
          <Link className="btn" to="/admin/orders">訂單列表</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card space-y-2">
          <div className="font-semibold">客戶資訊</div>
          <div className="text-sm">姓名：{o.customerName || "—"}</div>
          <div className="text-sm">電話：{o.phone || "—"}</div>
          <div className="text-sm">地址：{o.address || "—"}</div>
          <div className="text-sm">狀態：{o.status || "—"}</div>

          <div className="pt-3 border-t space-y-2">
            <div className="label">更新狀態</div>
            <div className="flex flex-wrap gap-2">
              {["pending", "paid", "shipped", "done", "cancelled"].map(s => (
                <button key={s} className="btn" disabled={busy} onClick={() => setStatus(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t flex items-center">
            <div className="text-sm text-slate-600">合計</div>
            <div className="ml-auto font-semibold">{money(o.total)}</div>
          </div>
        </div>

        <div className="card space-y-2">
          <div className="font-semibold">商品項目</div>
          <div className="divide-y">
            {(o.items || []).map((it, idx) => (
              <div key={idx} className="py-2 flex items-center">
                <div className="min-w-0">
                  <div className="truncate">{it.name || "—"}</div>
                  <div className="text-xs text-slate-500">{money(it.price)} × {it.qty}</div>
                </div>
                <div className="ml-auto font-semibold">
                  {money(Number(it.price || 0) * Number(it.qty || 0))}
                </div>
              </div>
            ))}
            {(o.items || []).length === 0 ? <div className="py-4 muted">無項目</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
