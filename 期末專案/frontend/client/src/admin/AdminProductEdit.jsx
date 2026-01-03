import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import { productsApi } from "../api/products.js";

export default function AdminProductEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", price: 0, stock: 0, description: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const p = await productsApi.get(id);
        setForm({
          name: p.name || "",
          price: Number(p.price || 0),
          stock: Number(p.stock || 0),
          description: p.description || ""
        });
      } catch (e) {
        setErr(e.message || "載入失敗");
      }
    })();
  }, [id]);

  async function save() {
    setErr("");
    setBusy(true);
    try {
      const payload = {
        name: String(form.name || "").trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        description: String(form.description || "")
      };
      if (!payload.name) throw new Error("商品名稱必填");
      if (Number.isNaN(payload.price) || payload.price < 0) throw new Error("價格不正確");
      if (Number.isNaN(payload.stock) || payload.stock < 0) throw new Error("庫存不正確");

      await productsApi.update(id, payload);
      alert("更新成功");
      nav("/admin/products");
    } catch (e) {
      setErr(e.message || "更新失敗");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="h1">後台｜編輯商品</div>
        <div className="ml-auto">
          <Link className="btn" to="/admin/products">回商品列表</Link>
        </div>
      </div>

      {err ? <div className="card border-red-200 bg-red-50 text-red-700 text-sm">{err}</div> : null}

      <div className="card max-w-2xl space-y-4">
        <ProductForm value={form} onChange={setForm} />
        <button className="btn-primary w-fit" disabled={busy} onClick={save}>
          {busy ? "儲存中..." : "儲存"}
        </button>
      </div>
    </div>
  );
}
