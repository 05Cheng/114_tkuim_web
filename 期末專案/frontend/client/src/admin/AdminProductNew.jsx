import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "../api/products";
import ProductForm from "../components/ProductForm";
import { useToast } from "../components/Toast";

export default function AdminProductNew() {
  const toast = useToast();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(body) {
    setSubmitting(true);
    try {
      await createProduct(body);
      toast.success("已新增");
      nav("/admin/products");
    } catch (e) {
      toast.error(e.message || "新增失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">新增商品</h1>
          <p className="text-sm text-slate-500">Create</p>
        </div>
        <Link className="text-sm text-slate-700 hover:underline" to="/admin/products">← 回列表</Link>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <ProductForm submitting={submitting} onSubmit={onSubmit} />
      </div>
    </div>
  );
}

