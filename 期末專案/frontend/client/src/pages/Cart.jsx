import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadCart, removeItem, updateQty, getTotal } from "../lib/cart.js";
import { useToast } from "../components/Toast.jsx";

export default function Cart() {
  const nav = useNavigate();
  const { push } = useToast();
  const [items, setItems] = useState([]);

  function refresh() {
    setItems(loadCart());
  }

  useEffect(() => {
    refresh();
  }, []);

  const total = getTotal();

  return (
    <div className="container-page py-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-black">購物車</div>
          <div className="text-sm text-slate-500 mt-1">可調整數量、刪除商品、前往結帳建立訂單</div>
        </div>
        <Link className="btn-outline" to="/">
          繼續購物
        </Link>
      </div>

      <div className="mt-5 card p-4">
        {items.length === 0 ? (
          <div className="text-slate-500">購物車是空的。</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>商品</th>
                  <th className="w-28">單價</th>
                  <th className="w-40">數量</th>
                  <th className="w-28">小計</th>
                  <th className="w-28">操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map((x) => (
                  <tr key={x.productId}>
                    <td>
                      <div className="font-bold">{x.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-2">{x.description || "—"}</div>
                    </td>
                    <td>${x.price}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn-outline px-3 py-1"
                          onClick={() => {
                            const next = Math.max(1, x.qty - 1);
                            setItems(updateQty(x.productId, next));
                          }}
                        >
                          -
                        </button>
                        <input
                          className="input w-20"
                          type="number"
                          min="1"
                          value={x.qty}
                          onChange={(e) => {
                            const next = Math.max(1, Number(e.target.value || 1));
                            setItems(updateQty(x.productId, next));
                          }}
                        />
                        <button
                          className="btn-outline px-3 py-1"
                          onClick={() => {
                            const next = x.qty + 1;
                            setItems(updateQty(x.productId, next));
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="font-bold">${x.qty * x.price}</td>
                    <td>
                      <button
                        className="btn-danger px-3 py-2"
                        onClick={() => {
                          setItems(removeItem(x.productId));
                          push("已移除商品", "success");
                        }}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-slate-600">
                總計：<span className="text-xl font-black text-blue-700">${total}</span>
              </div>
              <button
                className="btn-primary"
                onClick={() => {
                  nav("/checkout");
                }}
              >
                前往結帳
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


