import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function notify(msg) {
  alert(msg);
}

function getCart() {
  try {
    const raw = localStorage.getItem("cart");
    const arr = raw ? JSON.parse(raw) : [];
    // 預期 cart item: { productId, name, price, qty }
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.message || json?.error || `HTTP ${res.status}`
    );
  }

  // 你的後端格式可能是 { success, message, data }
  return json?.data ?? json;
}

function clampQty(raw, stock) {
  // raw: string|number
  let n = Math.floor(Number(raw));
  if (!Number.isFinite(n)) n = 1;
  if (n < 1) n = 1;

  if (Number.isFinite(stock) && stock >= 0) {
    if (stock === 0) return 0; // 庫存 0 特別處理
    if (n > stock) n = stock;
  }
  return n;
}

export default function Cart() {
  const nav = useNavigate();

  const [cart, setCartState] = useState(() => getCart());
  const [stocks, setStocks] = useState({}); // { productId: stockNumber|null }

  // 讀取庫存（優先 products/:id，若都失敗就 fallback products list）
  useEffect(() => {
    let alive = true;

    async function loadStocks() {
      try {
        const ids = [...new Set(cart.map((x) => x.productId))];
        if (ids.length === 0) {
          if (alive) setStocks({});
          return;
        }

        const pairs = await Promise.all(
          ids.map(async (id) => {
            try {
              const p = await apiGet(`/api/products/${id}`);
              const s = Number(p?.stock);
              return [id, Number.isFinite(s) ? s : null];
            } catch {
              return [id, null];
            }
          })
        );

        const allNull = pairs.every(([, s]) => !Number.isFinite(s));
        let map = {};

        if (!allNull) {
          for (const [id, s] of pairs) map[id] = Number.isFinite(s) ? s : null;
        } else {
          const list = await apiGet(`/api/products`);
          if (Array.isArray(list)) {
            for (const id of ids) {
              const p = list.find((x) => x?._id === id);
              const s = Number(p?.stock);
              map[id] = Number.isFinite(s) ? s : null;
            }
          } else {
            for (const id of ids) map[id] = null;
          }
        }

        if (!alive) return;
        setStocks(map);
      } catch {
        // 不影響畫面
      }
    }

    loadStocks();
    return () => {
      alive = false;
    };
  }, [cart]);

  const reloadCart = () => setCartState(getCart());

  const total = useMemo(() => {
    return cart.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
      0
    );
  }, [cart]);

  const updateQty = (productId, qtyNumber) => {
    const stock = stocks[productId];
    let qty = clampQty(qtyNumber, stock);

    // stock === 0 就直接提醒並設為 0（但購物車通常不允許 0，這裡直接移除也可以）
    if (Number.isFinite(stock) && stock === 0) {
      notify("庫存不足");
      // 這裡我選擇：直接移除該商品（比較合理）
      const next = cart.filter((it) => it.productId !== productId);
      saveCart(next);
      setCartState(next);
      return;
    }

    if (Number.isFinite(stock) && qty > stock) {
      notify(`庫存不足，目前庫存：${stock}`);
      qty = stock;
    }

    const next = cart.map((it) =>
      it.productId === productId ? { ...it, qty, qtyText: undefined } : it
    );
    saveCart(next);
    setCartState(next);
  };

  const removeItem = (productId) => {
    const next = cart.filter((it) => it.productId !== productId);
    saveCart(next);
    setCartState(next);
  };

  const clearCart = () => {
    saveCart([]);
    setCartState([]);
  };

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-slate-900">購物車</div>
            <div className="text-sm text-slate-500">
              可調整數量、刪除商品，前往結帳建立訂單
            </div>
          </div>

          <button
            className="h-10 rounded-xl border border-slate-200 px-4 font-semibold text-slate-800 hover:bg-white"
            onClick={() => {
              reloadCart();
              notify("已重新載入購物車");
            }}
            type="button"
          >
            重新載入
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
            <div className="text-slate-700">購物車是空的。</div>
            <button
              className="mt-4 h-11 rounded-xl bg-blue-600 text-white font-semibold px-5 hover:bg-blue-700"
              onClick={() => nav("/")}
              type="button"
            >
              回商品列表
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 清單 */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map((it) => {
                const stock = stocks[it.productId];
                const stockText = Number.isFinite(stock) ? `庫存：${stock}` : "庫存：—";

                const displayQty = it.qtyText ?? String(it.qty ?? 1);

                return (
                  <div
                    key={it.productId}
                    className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {it.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        單價：${Number(it.price) || 0} ・ {stockText}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* ✅ 數量：允許刪掉 1，離開再 clamp */}
                      <input
                        className="h-10 w-24 rounded-xl border border-slate-200 px-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
                        type="text"
                        inputMode="numeric"
                        value={displayQty}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (!/^\d*$/.test(v)) return;

                          // 允許空字串（可把 1 刪掉）
                          const next = cart.map((x) =>
                            x.productId === it.productId ? { ...x, qtyText: v } : x
                          );
                          saveCart(next);
                          setCartState(next);

                          // 有數字就即時更新 qty（讓小計同步）
                          if (v !== "") {
                            updateQty(it.productId, v);
                          }
                        }}
                        onBlur={() => {
                          // 離開輸入框 -> 最少 1、並且套用庫存限制
                          const raw = (it.qtyText ?? String(it.qty ?? "1"));
                          const safe = raw === "" ? 1 : Math.floor(Number(raw));
                          updateQty(it.productId, safe);
                        }}
                        placeholder="1"
                      />

                      <div className="w-28 text-right font-semibold text-slate-900">
                        ${(Number(it.price) || 0) * (Number(it.qty) || 0)}
                      </div>

                      <button
                        className="h-10 rounded-xl border border-slate-200 px-3 font-semibold text-slate-800 hover:bg-slate-50"
                        onClick={() => removeItem(it.productId)}
                        type="button"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 摘要 */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6 h-fit">
              <div className="text-lg font-bold text-slate-900">訂單摘要</div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-slate-600">總計</div>
                <div className="text-2xl font-bold text-blue-600">${total}</div>
              </div>

              <button
                className="mt-4 h-11 w-full rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                onClick={() => nav("/checkout")}
                type="button"
              >
                前往結帳
              </button>

              <button
                className="mt-3 h-11 w-full rounded-xl border border-slate-200 font-semibold text-slate-800 hover:bg-slate-50"
                onClick={() => nav("/")}
                type="button"
              >
                繼續購物
              </button>

              <button
                className="mt-3 h-11 w-full rounded-xl border border-rose-200 font-semibold text-rose-700 hover:bg-rose-50"
                onClick={clearCart}
                type="button"
              >
                清空購物車
              </button>

              <div className="mt-3 text-xs text-slate-500">
                * 庫存會在「結帳送出訂單成功」後由後端扣除
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
