import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { user } = useAuth();
  const { cart, fetchCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchCart(user.id);
  }, [user]);

  if (!user) return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#8892A4", marginBottom: "20px" }}>Please login to view your cart.</p>
        <Link to="/login" style={{ color: "#F5C518" }}>Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "36px", marginBottom: "32px" }}>
        Your Cart
      </h1>

      {cart.items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
          <p style={{ color: "#8892A4", fontSize: "18px", marginBottom: "24px" }}>Your cart is empty</p>
          <Link to="/products" style={{
            background: "#F5C518", color: "#0A0F2C",
            padding: "14px 32px", borderRadius: "10px",
            textDecoration: "none", fontWeight: "700"
          }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", maxWidth: "1000px" }}>
          {/* Cart items */}
          <div>
            {cart.items.map(item => (
              <div key={item.productId} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px", padding: "20px",
                display: "flex", gap: "20px", marginBottom: "16px",
                alignItems: "center"
              }}>
                <div style={{
                  width: "80px", height: "80px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "10px", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "32px", flexShrink: 0
                }}>📦</div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "4px" }}>{item.name}</h3>
                  <p style={{ color: "#8892A4", fontSize: "13px" }}>by {item.sellerName}</p>
                  <p style={{ color: "#8892A4", fontSize: "13px" }}>Qty: {item.quantity}</p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#F5C518", fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>
                    £{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(user.id, item.productId)}
                    style={{
                      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                      color: "#ef4444", padding: "6px 14px",
                      borderRadius: "8px", cursor: "pointer", fontSize: "12px"
                    }}>Remove</button>
                </div>
              </div>
            ))}

            <button onClick={() => clearCart(user.id)} style={{
              background: "transparent", border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444", padding: "10px 20px",
              borderRadius: "8px", cursor: "pointer", fontSize: "13px"
            }}>Clear Cart</button>
          </div>

          {/* Order summary */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(245,197,24,0.15)",
            borderRadius: "16px", padding: "28px",
            height: "fit-content"
          }}>
            <h2 style={{ color: "#fff", fontSize: "20px", marginBottom: "24px" }}>Order Summary</h2>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ color: "#8892A4" }}>Items ({cart.itemCount})</span>
              <span style={{ color: "#fff" }}>£{cart.total?.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <span style={{ color: "#8892A4" }}>Shipping</span>
              <span style={{ color: "#22c55e" }}>FREE</span>
            </div>
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "20px", marginBottom: "24px",
              display: "flex", justifyContent: "space-between"
            }}>
              <span style={{ color: "#fff", fontWeight: "700", fontSize: "18px" }}>Total</span>
              <span style={{ color: "#F5C518", fontWeight: "700", fontSize: "22px" }}>
                £{cart.total?.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                width: "100%", padding: "16px",
                background: "#F5C518", color: "#0A0F2C",
                border: "none", borderRadius: "10px",
                fontWeight: "700", fontSize: "16px", cursor: "pointer"
              }}>
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
