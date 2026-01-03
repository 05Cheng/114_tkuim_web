import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { readCart, updateQty, clearCart } from "../lib/cart.js";

function money(n) {
  return Number(n || 0).toLocaleString("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });
}

export default function Cart() {
  const nav = useNavigate();
  const [cart, setCart] = useState(readCart());

  const total = useMemo(
    () => cart.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 0), 0),
    [cart]
  );

  function setQty(productId, qty) {
    const next = updateQty(productId, Number(qty));
    setCart(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h1">購物車</div>
        <div className="ml-auto flex gap-2">
          <button className="btn" onClick={() => { clearCart(); setCart([]); }}>清空</button>
          <button className="btn-primary" disabled={cart.length === 0} onClick={() => nav("/checkout")}>
            去結帳
          </button>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="card text-sm">
          購物車是空的。<Link className="underline" to="/">回商品列表</Link>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="divide-y">
            {cart.map(it => (
              <div key={it.productId} className="p-4 flex items-center gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-sm text-slate-500">{money(it.price)}</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <input className="input w-20" type="number" min="0" value={it.qty}
                    onChange={(e) => setQty(it.productId, e.target.value)} />
                  <div className="w-28 text-right font-semibold">{money(Number(it.price) * Number(it.qty))}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-slate-50 flex items-center">
            <div className="text-sm text-slate-600">合計</div>
            <div className="ml-auto font-semibold">{money(total)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
