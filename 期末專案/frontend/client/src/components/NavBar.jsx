import { NavLink } from "react-router-dom";

function Link({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-lg px-3 py-2 text-sm font-medium",
          isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-900" />
          <div>
            <div className="text-sm font-semibold text-slate-900">ShopLite</div>
            <div className="text-xs text-slate-500">商品購物 + 訂單管理</div>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/">商品</Link>
          <Link to="/cart">購物車</Link>
          <Link to="/admin/products">後台</Link>
        </nav>
      </div>
    </header>
  );
}

