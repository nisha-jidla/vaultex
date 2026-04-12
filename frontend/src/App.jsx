import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import { SellerLogin, SellerRegister } from "./pages/SellerAuth";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/"                 element={<Home />} />
            <Route path="/products"         element={<Products />} />
            <Route path="/login"            element={<Login />} />
            <Route path="/register"         element={<Register />} />
            <Route path="/cart"             element={<Cart />} />
            <Route path="/checkout"         element={<Checkout />} />
            <Route path="/orders"           element={<Orders />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/login"     element={<SellerLogin />} />
            <Route path="/seller/register"  element={<SellerRegister />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
