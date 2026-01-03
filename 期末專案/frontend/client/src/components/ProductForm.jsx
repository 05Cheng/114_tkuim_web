import { useState } from "react";

export default function ProductForm({ initial, onSubmit, submitting }) {
  const [name, setName] = useState(initial?.name || "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [description, setDescription] = useState(initial?.description || "");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      description: description.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">商品名稱</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：無線耳機"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">價格</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">庫存</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">描述</label>
          <textarea
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="商品特色、規格…"
          />
        </div>
      </div>

      <button
        disabled={submitting}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {submitting ? "處理中..." : "儲存"}
      </button>
    </form>
  );
}
