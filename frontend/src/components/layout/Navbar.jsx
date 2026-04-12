import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, seller, logout } = useAuth();
  const { cart } = useCart();
  const navigate  = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav style={{
      background: "#0A0F2C",
      borderBottom: "1px solid rgba(245,197,24,0.15)",
      padding: "0 2rem",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "36px", height: "36px", background: "#F5C518",
          borderRadius: "8px", display: "flex", alignItems: "center",
          justifyContent: "center", fontWeight: "900", color: "#0A0F2C", fontSize: "18px"
        }}>V</div>
        <span style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700" }}>
          Vaultex
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link to="/products" style={{ color: "#8892A4", textDecoration: "none", fontSize: "14px" }}>
          Products
        </Link>

        {user && (
          <Link to="/cart" style={{ color: "#8892A4", textDecoration: "none", fontSize: "14px", position: "relative" }}>
            🛒 Cart
            {cart.itemCount > 0 && (
              <span style={{
                position: "absolute", top: "-8px", right: "-12px",
                background: "#F5C518", color: "#0A0F2C",
                borderRadius: "999px", fontSize: "10px", fontWeight: "700",
                padding: "1px 5px"
              }}>{cart.itemCount}</span>
            )}
          </Link>
        )}

        {user ? (
          <>
            <Link to="/orders" style={{ color: "#8892A4", textDecoration: "none", fontSize: "14px" }}>
              Orders
            </Link>
            <span style={{ color: "#F5C518", fontSize: "14px" }}>Hi, {user.name?.split(" ")[0]}</span>
            <button onClick={handleLogout} style={{
              background: "transparent", border: "1px solid #8892A4",
              color: "#8892A4", padding: "6px 14px", borderRadius: "6px",
              cursor: "pointer", fontSize: "13px"
            }}>Logout</button>
          </>
        ) : seller ? (
          <>
            <Link to="/seller/dashboard" style={{ color: "#F5C518", textDecoration: "none", fontSize: "14px" }}>
              Dashboard
            </Link>
            <button onClick={handleLogout} style={{
              background: "transparent", border: "1px solid #8892A4",
              color: "#8892A4", padding: "6px 14px", borderRadius: "6px",
              cursor: "pointer", fontSize: "13px"
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "#8892A4", textDecoration: "none", fontSize: "14px" }}>Login</Link>
            <Link to="/register" style={{
              background: "#F5C518", color: "#0A0F2C",
              padding: "8px 18px", borderRadius: "8px",
              textDecoration: "none", fontSize: "13px", fontWeight: "700"
            }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
