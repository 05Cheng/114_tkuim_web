import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";

import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";

import AdminProducts from "./admin/AdminProducts.jsx";
import AdminProductNew from "./admin/AdminProductNew.jsx";
import AdminProductEdit from "./admin/AdminProductEdit.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminOrderDetail from "./admin/AdminOrderDetail.jsx";

function NotFound() {
  return (
    <div className="card">
      <div className="h1">404</div>
      <div className="muted">找不到頁面</div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductNew />} />
          <Route path="/admin/products/:id" element={<AdminProductEdit />} />

          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  );
}
