import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function notify(msg) {
  alert(msg);
}

function clampInt(val, min, max) {
  let n = Math.floor(Number(val));
  if (!Number.isFinite(n)) n = min;
  if (n < min) n = min;
  if (typeof max === "number" && Number.isFinite(max) && n > max) n = max;
  return n;
}

function getCart() {
  try {
    const raw = localStorage.getItem("cart");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.message || json?.error || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  // 你的後端格式可能是 { success, message, data }
  return json?.data ?? json;
}

async function fetchProductByIdOrList(id) {
  // 先試 /api/products/:id
  try {
    const p = await apiGet(`/api/products/${id}`);
    if (p && (p._id || p.id)) return p;
  } catch (e) {
    // 404 或其他就 fallback
  }

  // fallback: /api/products 取 list 再找
  const list = await apiGet(`/api/products`);
  if (Array.isArray(list)) {
    const p = list.find((x) => x?._id === id || x?.id === id);
    if (p) return p;
  }

  return null;
}

export default function ProductDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [product, setProduct] = useState(null);

  // 文字輸入（允許空字串，才能把 1 刪掉）
  const [qtyText, setQtyText] = useState("1");

  const stock = useMemo(() => {
    const s = Number(product?.stock);
    return Number.isFinite(s) ? s : null;
  }, [product]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErrMsg("");
      try {
        const p = await fetchProductByIdOrList(id);
        if (!alive) return;

        if (!p) {
          setProduct(null);
          setErrMsg("找不到商品");
        } else {
          setProduct(p);
          // 若庫存為 0，顯示 0；否則預設 1
          const s = Number(p?.stock);
          if (Number.isFinite(s) && s <= 0) setQtyText("0");
          else setQtyText("1");
        }
      } catch (e) {
        if (!alive) return;
        setProduct(null);
        setErrMsg(e?.message || "讀取失敗");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const applyBlurClamp = () => {
    if (stock === 0) {
      setQtyText("0");
      return;
    }

    // 允許使用者清空後離開 -> 變回 1
    if (qtyText === "") {
      setQtyText("1");
      return;
    }

    const raw = Math.floor(Number(qtyText));
    if (!Number.isFinite(raw)) {
      setQtyText("1");
      return;
    }

    // ✅ 先用 raw 判斷庫存不足（要先提示）
    if (Number.isFinite(stock) && raw > stock) {
      notify(`庫存不足，目前庫存：${stock}`);
      setQtyText(String(stock));
      return;
    }

    if (raw < 1) {
      setQtyText("1");
      return;
    }

    setQtyText(String(raw));
  };

  const dec = () => {
    if (stock === 0) return;
    const cur = clampInt(qtyText === "" ? 1 : qtyText, 1);
    const next = Math.max(1, cur - 1);
    setQtyText(String(next));
  };

  const inc = () => {
    if (stock === 0) return;
    const cur = clampInt(qtyText === "" ? 1 : qtyText, 1);
    const desired = cur + 1;

    if (Number.isFinite(stock) && desired > stock) {
      notify(`庫存不足，目前庫存：${stock}`);
      setQtyText(String(stock));
      return;
    }

    setQtyText(String(desired));
  };

  const addToCart = () => {
    if (!product) return;

    if (stock === 0) {
      notify("庫存不足，無法加入購物車");
      return;
    }

    // ✅ 先用使用者想要的數量判斷要不要提示
    const raw = Math.floor(Number(qtyText === "" ? 1 : qtyText));
    const desired = Number.isFinite(raw) ? raw : 1;

    if (Number.isFinite(stock) && desired > stock) {
      notify(`庫存不足，目前庫存：${stock}`);
      setQtyText(String(stock));
      return;
    }

    // 再 clamp（最少 1，最多庫存）
    const max = Number.isFinite(stock) ? stock : undefined;
    const q = clampInt(desired, 1, max);

    const cart = getCart();
    const pid = product._id || product.id;

    const i = cart.findIndex((x) => x?.productId === pid);
    if (i >= 0) {
      const nextQty = (Number(cart[i].qty) || 0) + q;

      if (Number.isFinite(stock) && nextQty > stock) {
        notify(`庫存不足，目前庫存：${stock}`);
        cart[i].qty = stock; // 自動修正到最大可買
      } else {
        cart[i].qty = nextQty;
      }
    } else {
      cart.push({
        productId: pid,
        name: product.name,
        price: Number(product.price) || 0,
        qty: q,
      });
    }

    setCart(cart);
    notify("已加入購物車");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
            <div className="text-slate-700">載入中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
            <div className="text-rose-600 font-semibold">讀取失敗</div>
            <div className="text-slate-700 mt-1">{errMsg || "找不到商品"}</div>
            <button
              className="mt-4 h-11 rounded-xl bg-blue-600 text-white font-semibold px-5 hover:bg-blue-700"
              onClick={() => nav("/")}
              type="button"
            >
              回商品列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <button
          className="text-sm text-slate-600 hover:text-slate-900"
          onClick={() => nav("/")}
          type="button"
        >
          ← 回商品列表
        </button>

        <div className="mt-4 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-2xl font-bold text-slate-900">{product.name}</div>
              <div className="text-slate-500 mt-1">{product.description || "—"}</div>
              <div className="mt-3 text-2xl font-extrabold text-blue-600">
                ${Number(product.price) || 0}
              </div>
            </div>

            <div className="text-sm text-slate-600">
              庫存：{" "}
              <span className="font-semibold text-slate-900">
                {Number.isFinite(stock) ? stock : "—"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-slate-700">數量</div>

              <button
                className="h-10 w-10 rounded-xl border border-slate-200 font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                onClick={dec}
                disabled={stock === 0}
                type="button"
              >
                -
              </button>

              <input
                type="text"
                inputMode="numeric"
                value={qtyText}
                onChange={(e) => {
                  const v = e.target.value;
                  // ✅ 允許空字串，才能把 1 刪掉
                  if (/^\d*$/.test(v)) setQtyText(v);
                }}
                onBlur={applyBlurClamp}
                placeholder="1"
                className="h-10 w-24 rounded-xl border border-slate-200 px-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
                disabled={stock === 0}
              />

              <button
                className="h-10 w-10 rounded-xl border border-slate-200 font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                onClick={inc}
                disabled={stock === 0}
                type="button"
              >
                +
              </button>

              {stock === 0 && (
                <div className="text-sm font-semibold text-rose-600">庫存不足</div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                className="h-11 rounded-xl bg-blue-600 text-white font-semibold px-5 hover:bg-blue-700 disabled:opacity-50"
                onClick={addToCart}
                disabled={stock === 0}
                type="button"
              >
                加入購物車
              </button>

              <button
                className="h-11 rounded-xl border border-slate-200 font-semibold px-5 text-slate-800 hover:bg-slate-50"
                onClick={() => nav("/cart")}
                type="button"
              >
                去購物車
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            * 超過庫存會提示「庫存不足」，並限制最大可買數量
          </div>
        </div>
      </div>
    </div>
  );
}
