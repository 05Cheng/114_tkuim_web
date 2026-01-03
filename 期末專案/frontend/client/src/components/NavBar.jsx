import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { readCart } from "../lib/cart.js";

export default function NavBar() {
  const [count, setCount] = useState(0);
  const loc = useLocation();

  useEffect(() => {
    const cart = readCart();
    setCount(cart.reduce((s, x) => s + Number(x.qty || 0), 0));
  }, [loc.pathname]);

  const cls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`;

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link to="/" className="font-semibold text-lg">ShopLite</Link>

        <nav className="ml-auto flex items-center gap-2">
          <NavLink to="/" className={cls} end>商品</NavLink>
          <NavLink to="/cart" className={cls}>購物車 ({count})</NavLink>
          <NavLink to="/admin/products" className={cls}>後台</NavLink>
        </nav>
      </div>
    </header>
  );
}
