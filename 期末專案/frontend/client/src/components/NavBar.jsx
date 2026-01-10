import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getCount } from "../lib/cart.js";

export default function NavBar() {
  const nav = useNavigate();
  const loc = useLocation();
  const [q, setQ] = useState("");

  const cartCount = useMemo(() => getCount(), [loc.pathname]); // 路由變動刷新一下

  function onSearch(e) {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (q.trim()) qs.set("q", q.trim());
    nav({ pathname: "/", search: qs.toString() });
  }

  return (
    <header className="bg-blue-600 text-white">
      <div className="container-page">
        <div className="flex items-center justify-between py-3 gap-3">
          <Link to="/" className="font-black text-xl tracking-wide">
            ShopLite
          </Link>

          <form onSubmit={onSearch} className="flex-1 max-w-2xl">
            <div className="flex bg-white rounded-lg overflow-hidden">
              <input
                className="w-full px-4 py-2 text-slate-900 outline-none"
                placeholder="搜尋商品..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="px-5 font-bold bg-blue-800 hover:bg-blue-900 transition">搜尋</button>
            </div>
          </form>

          <div className="flex items-center gap-4">
            <NavLink to="/admin/products" className="text-sm font-bold hover:opacity-90">
              後台
            </NavLink>
            <Link to="/cart" className="relative font-bold hover:opacity-90">
              購物車
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-yellow-300 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="pb-3 text-sm flex gap-4 opacity-95">
          <NavLink to="/" className="hover:underline">
            商品
          </NavLink>
          <NavLink to="/admin/products" className="hover:underline">
            商品管理
          </NavLink>
          <NavLink to="/admin/orders" className="hover:underline">
            訂單管理
          </NavLink>
        </nav>
      </div>
    </header>
  );
}




