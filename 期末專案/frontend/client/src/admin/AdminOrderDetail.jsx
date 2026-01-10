import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ordersAPI } from "../api/orders.js";
import { useToast } from "../components/Toast.jsx";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { push } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [o, setO] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await ordersAPI.get(id);
      setO(data);
    } catch (e) {
      setErr(e.message || "Load failed");
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
      await ordersAPI.update(id, { status });
      push("狀態已更新", "success");
      load();
    } catch (e) {
      push(`更新失敗：${e.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="container-page py-6 text-slate-500">載入中...</div>;
  if (err) return <div className="container-page py-6 text-red-600">載入失敗：{err}</div>;
  if (!o) return <div className="container-page py-6 text-slate-500">找不到訂單</div>;

  return (
    <div className="container-page py-6">
      <div className="card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-black">訂單詳情</div>
            <div className="text-xs text-slate-500 font-mono mt-1">{o._id}</div>
          </div>
          <Link className="btn-outline" to="/admin/orders">
            回訂單列表
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="font-black">收件人</div>
            <div className="mt-2 text-sm text-slate-700">
              <div>姓名：{o.customer?.name || "—"}</div>
              <div>電話：{o.customer?.phone || "—"}</div>
              <div>地址：{o.customer?.address || "—"}</div>
            </div>

            <div className="mt-4">
              <div className="font-black">狀態</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button disabled={saving} className="btn-outline" onClick={() => setStatus("pending")}>
                  pending
                </button>
                <button disabled={saving} className="btn-outline" onClick={() => setStatus("paid")}>
                  paid
                </button>
                <button disabled={saving} className="btn-outline" onClick={() => setStatus("shipped")}>
                  shipped
                </button>
                <button disabled={saving} className="btn-outline" onClick={() => setStatus("cancelled")}>
                  cancelled
                </button>
              </div>
            </div>

            <div className="mt-4 text-slate-600">
              總計：<span className="text-2xl font-black text-blue-700">${Number(o.total || 0)}</span>
            </div>
          </div>

          <div className="card p-5">
            <div className="font-black">商品明細</div>
            <div className="mt-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>商品</th>
                    <th className="w-28">單價</th>
                    <th className="w-20">數量</th>
                    <th className="w-28">小計</th>
                  </tr>
                </thead>
                <tbody>
                  {(o.items || []).map((x, idx) => (
                    <tr key={idx}>
                      <td className="font-bold">{x.name || "—"}</td>
                      <td>${Number(x.price || 0)}</td>
                      <td>{Number(x.qty || 0)}</td>
                      <td className="font-bold">${Number(x.price || 0) * Number(x.qty || 0)}</td>
                    </tr>
                  ))}
                  {(o.items || []).length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-slate-500 py-6 text-center">
                        沒有商品
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


