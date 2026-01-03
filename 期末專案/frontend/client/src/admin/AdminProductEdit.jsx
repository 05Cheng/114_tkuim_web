import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../api/products";
import ProductForm from "../components/ProductForm";
import { useToast } from "../components/Toast";

export default function AdminProductEdit() {
  const { id } = useParams();
  const toast = useToast();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getProduct(id);
        setItem(data);
      } catch (e) {
        toast.error(e.message || "載入失敗");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSubmit(body) {
    setSubmitting(true);
    try {
      await updateProduct(id, body);
      toast.success("已更新");
      nav("/admin/products");
    } catch (e) {
      toast.error(e.message || "更新失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">編輯商品</h1>
          <p className="text-sm text-slate-500">Update</p>
        </div>
        <Link className="text-sm text-slate-700 hover:underline" to="/admin/products">← 回列表</Link>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        {loading ? (
          <div className="text-sm text-slate-500">載入中...</div>
        ) : item ? (
          <ProductForm initial={item} submitting={submitting} onSubmit={onSubmit} />
        ) : (
          <div className="text-sm text-slate-500">找不到商品</div>
        )}
      </div>
    </div>
  );
}

