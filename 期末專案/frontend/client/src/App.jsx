import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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

export default function App() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AdminProductNew />} />
        <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />

        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="mt-10 py-10 text-center text-sm text-slate-500">
        <div className="container-page">ShopLite © {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}


