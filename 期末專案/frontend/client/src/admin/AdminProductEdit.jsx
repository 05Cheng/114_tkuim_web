import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import { productsAPI } from "../api/products.js";
import { useToast } from "../components/Toast.jsx";

export default function AdminProductEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { push } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await productsAPI.get(id);
        setP(data);
      } catch (e) {
        setErr(e.message || "Load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function save(payload) {
    setSaving(true);
    try {
      await productsAPI.update(id, payload);
      push("更新成功", "success");
      nav("/admin/products");
    } catch (e) {
      push(`更新失敗：${e.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!confirm("確定要刪除？")) return;
    try {
      await productsAPI.remove(id);
      push("已刪除", "success");
      nav("/admin/products");
    } catch (e) {
      push(`刪除失敗：${e.message}`, "error");
    }
  }

  if (loading) return <div className="container-page py-6 text-slate-500">載入中...</div>;
  if (err) return <div className="container-page py-6 text-red-600">載入失敗：{err}</div>;
  if (!p) return <div className="container-page py-6 text-slate-500">找不到商品</div>;

  return (
    <div className="container-page py-6">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-black">編輯商品</div>
          <div className="flex gap-2">
            <button className="btn-danger" onClick={del}>
              刪除
            </button>
            <Link className="btn-outline" to="/admin/products">
              回列表
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <ProductForm initial={p} loading={saving} submitText="儲存" onSubmit={save} />
        </div>
      </div>
    </div>
  );
}


