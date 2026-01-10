import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import { productsAPI } from "../api/products.js";
import { useToast } from "../components/Toast.jsx";

export default function AdminProductNew() {
  const nav = useNavigate();
  const { push } = useToast();
  const [loading, setLoading] = useState(false);

  async function create(payload) {
    setLoading(true);
    try {
      await productsAPI.create(payload);
      push("新增成功", "success");
      nav("/admin/products");
    } catch (e) {
      push(`新增失敗：${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-6">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-black">新增商品</div>
          <Link className="btn-outline" to="/admin/products">
            回列表
          </Link>
        </div>

        <div className="mt-4">
          <ProductForm loading={loading} submitText="建立" onSubmit={create} />
        </div>
      </div>
    </div>
  );
}


