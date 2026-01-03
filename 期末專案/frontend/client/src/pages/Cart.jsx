import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calcTotal, clearCart, getCartItems, removeItem, updateQty } from "../lib/cart";
import { useToast } from "../components/Toast";

export default function Cart() {
  const toast = useToast();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const total = calcTotal(items);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">購物車</h1>
          <p className="text-sm text-slate-500">可調整數量、刪除商品、前往結帳建立訂單</p>
        </div>
        <Link className="text-sm text-slate-700 hover:underline" to="/">← 回商品</Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border bg-white p-6 text-sm text-slate-600">
          購物車是空的。<Link className="font-semibold underline" to="/">回商品列表</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="space-y-3">
              {items.map((x) => (
                <div key={x.productId} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{x.name}</div>
                    <div className="text-xs text-slate-500">${Number(x.price || 0)} / 件</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      className="w-20 rounded-lg border px-2 py-1 text-sm"
                      type="number"
                      min="1"
                      value={x.qty}
                      onChange={(e) => {
                        const v = e.target.value;
                        const next = updateQty(x.productId, v);
                        setItems(next);
                      }}
                    />
                    <button
                      onClick={() => {
                        const next = removeItem(x.productId);
                        setItems(next);
                        toast.info("已移除");
                      }}
                      className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  clearCart();
                  setItems([]);
                  toast.info("已清空購物車");
                }}
                className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                清空
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">結帳摘要</div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-600">總金額</span>
              <span className="font-bold text-slate-900">${total}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-4 block rounded-xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
            >
              前往結帳
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

