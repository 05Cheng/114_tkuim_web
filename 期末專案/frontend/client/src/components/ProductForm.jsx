import React, { useMemo, useState } from "react";

export default function ProductForm({ initial, onSubmit, submitText = "儲存", loading }) {
  const init = useMemo(
    () => ({
      name: initial?.name || "",
      price: initial?.price ?? 0,
      stock: initial?.stock ?? 0,
      description: initial?.description || ""
    }),
    [initial]
  );

  const [form, setForm] = useState(init);

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function submit(e) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      description: (form.description || "").trim()
    };
    onSubmit(payload);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <div className="text-sm font-bold mb-1">商品名稱</div>
        <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-bold mb-1">價格</div>
          <input className="input" type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} />
        </div>
        <div>
          <div className="text-sm font-bold mb-1">庫存</div>
          <input className="input" type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </div>
      </div>

      <div>
        <div className="text-sm font-bold mb-1">描述</div>
        <textarea className="input min-h-[120px]" value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="flex gap-3">
        <button disabled={loading} className="btn-primary">
          {loading ? "處理中..." : submitText}
        </button>
      </div>
    </form>
  );
}

