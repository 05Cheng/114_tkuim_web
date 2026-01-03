import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import AdminProducts from "./admin/AdminProducts";
import AdminProductNew from "./admin/AdminProductNew";
import AdminProductEdit from "./admin/AdminProductEdit";
import AdminOrders from "./admin/AdminOrders";
import AdminOrderDetail from "./admin/AdminOrderDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AdminProductNew />} />
        <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />

        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <div className="py-10" />
    </div>
  );
}

