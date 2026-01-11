import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function notify(msg) {
  alert(msg);
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
  if (!res.ok) throw new Error(json?.message || json?.error || `HTTP ${res.status}`);
  return json?.data ?? json;
}

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || json?.error || `HTTP ${res.status}`);
  return json?.data ?? json;
}

export default function Checkout() {
  const nav = useNavigate();

  const [cart, setCartState] = useState(() => getCart());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = useMemo(() => {
    return cart.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  }, [cart]);

  const phoneOk = /^\d{10}$/.test(phone);

  const checkStockBeforeSubmit = async () => {
    // 送出前抓最新庫存，先擋一次（後端也會擋）
    const ids = [...new Set(cart.map((x) => x.productId))];
    const stocks = {};

    // 優先 /api/products/:id，失敗就 fallback list
    const pairs = await Promise.all(
      ids.map(async (id) => {
        try {
          const p = await apiGet(`/api/products/${id}`);
          return [id, Number(p?.stock)];
        } catch {
          return [id, null];
        }
      })
    );

    const allNull = pairs.every(([, s]) => !Number.isFinite(s));
    if (!allNull) {
      for (const [id, s] of pairs) stocks[id] = Number.isFinite(s) ? s : null;
    } else {
      const list = await apiGet(`/api/products`);
      if (Array.isArray(list)) {
        for (const id of ids) {
          const p = list.find((x) => x?._id === id);
          const s = Number(p?.stock);
          stocks[id] = Number.isFinite(s) ? s : null;
        }
      }
    }

    for (const it of cart) {
      const s = stocks[it.productId];
      if (Number.isFinite(s) && Number(it.qty) > s) {
        throw new Error(`庫存不足：${it.name} 目前庫存 ${s}，你選了 ${it.qty}`);
      }
    }
  };

  const submit = async () => {
    if (cart.length === 0) {
      notify("購物車是空的");
      nav("/cart");
      return;
    }
    if (!name.trim()) {
      notify("請填寫姓名");
      return;
    }
    if (!phoneOk) {
      notify("電話只能是 10 碼數字");
      return;
    }
    if (!address.trim()) {
      notify("請填寫地址");
      return;
    }

    setSubmitting(true);

    try {
      await checkStockBeforeSubmit();

      // ⚠️ 這裡只送一種 payload（不動後端）
      // 如果你的後端需要不同欄位名稱，你再把這段 payload 換成你後端真正吃的格式即可
      const payload = {
        customer: { name: name.trim(), phone, address: address.trim() },
        items: cart.map((it) => ({
          productId: it.productId,
          qty: Number(it.qty) || 0,
        })),
      };

      await apiPost("/api/orders", payload);

      // 成功：清空購物車
      setCart([]);
      setCartState([]);
      notify("下單成功！");
      nav("/admin/orders"); // 你也可以改 nav("/") 或 nav("/orders")
    } catch (e) {
      notify(e?.message || "下單失敗");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4">
          <button className="text-sm text-slate-600 hover:text-slate-900" onClick={() => nav("/cart")} type="button">
            ← 回購物車
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 表單 */}
          <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
            <div className="text-xl font-bold text-slate-900">結帳</div>
            <div className="text-sm text-slate-500 mt-1">填寫資料並送出訂單</div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-1">姓名</div>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="王小明"
                />
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-1">電話（10碼）</div>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={phone}
                  onChange={(e) => {
                    // ✅ 只允許數字，最多 10 碼
                    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(v);
                  }}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="0912345678"
                />
                {!phoneOk && phone.length > 0 && (
                  <div className="mt-1 text-xs text-rose-600">電話只能是 10 碼數字</div>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-1">地址</div>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="台北市..."
                />
              </div>

              <button
                className="mt-2 h-11 w-full rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                onClick={submit}
                disabled={submitting}
                type="button"
              >
                {submitting ? "送出中..." : "送出訂單"}
              </button>
            </div>
          </div>

          {/* 摘要 */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6 h-fit">
            <div className="text-lg font-bold text-slate-900">訂單摘要</div>

            <div className="mt-3 space-y-2">
              {cart.map((it) => (
                <div key={it.productId} className="flex items-center justify-between text-sm">
                  <div className="text-slate-700 truncate max-w-[200px]">
                    {it.name} × {it.qty}
                  </div>
                  <div className="font-semibold text-slate-900">
                    ${(Number(it.price) || 0) * (Number(it.qty) || 0)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-slate-600">總計</div>
              <div className="text-2xl font-bold text-blue-600">${total}</div>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              * 送出前會先檢查庫存；若庫存不足會跳出提示
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
