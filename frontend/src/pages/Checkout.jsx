import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderAPI, paymentAPI } from "../api";

export default function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [step,    setStep]    = useState(1); // 1=address, 2=payment, 3=confirm
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState({ method: "card", cardLast4: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handlePlaceOrder = async () => {
    setLoading(true); setError("");
    try {
      // 1. Place order
      const orderRes = await orderAPI.place({
        userId:  user.id,
        items:   cart.items.map(i => ({
          productId:  i.productId,
          name:       i.name,
          price:      i.price,
          quantity:   i.quantity,
          sellerId:   i.sellerId,
          sellerName: i.sellerName,
        })),
        address,
      });

      // 2. Process payment
      await paymentAPI.process({
        orderId:       orderRes.data.orderId,
        userId:        user.id,
        amount:        cart.total,
        paymentMethod: payment.method,
        cardLast4:     payment.cardLast4 || "0000",
      });

      // 3. Clear cart
      await clearCart(user.id);

      // 4. Go to orders
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.error || "Order failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "36px", marginBottom: "32px" }}>
        Checkout
      </h1>

      {/* Steps */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "40px" }}>
        {["Delivery", "Payment", "Confirm"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: step > i ? "#F5C518" : step === i + 1 ? "#F5C518" : "rgba(255,255,255,0.1)",
              color: step >= i + 1 ? "#0A0F2C" : "#8892A4",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "700"
            }}>{i + 1}</div>
            <span style={{ color: step === i + 1 ? "#fff" : "#8892A4", fontSize: "14px" }}>{s}</span>
            {i < 2 && <span style={{ color: "#8892A4", margin: "0 4px" }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "500px" }}>
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", padding: "12px", borderRadius: "10px",
            fontSize: "13px", marginBottom: "20px"
          }}>{error}</div>
        )}

        {/* Step 1: Address */}
        {step === 1 && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "32px"
          }}>
            <h2 style={{ color: "#fff", marginBottom: "24px" }}>Delivery Address</h2>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter your full delivery address..."
              rows={4}
              style={{
                width: "100%", padding: "14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "#fff",
                fontSize: "14px", outline: "none",
                resize: "none", boxSizing: "border-box"
              }}
            />
            <button
              onClick={() => address.trim() && setStep(2)}
              style={{
                width: "100%", padding: "14px", marginTop: "16px",
                background: "#F5C518", color: "#0A0F2C",
                border: "none", borderRadius: "10px",
                fontWeight: "700", cursor: "pointer"
              }}>Continue →</button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "32px"
          }}>
            <h2 style={{ color: "#fff", marginBottom: "24px" }}>Payment Method</h2>
            {["card", "paypal", "wallet"].map(m => (
              <div key={m} onClick={() => setPayment({ ...payment, method: m })}
                style={{
                  padding: "16px", borderRadius: "10px", marginBottom: "12px",
                  border: `1px solid ${payment.method === m ? "#F5C518" : "rgba(255,255,255,0.08)"}`,
                  background: payment.method === m ? "rgba(245,197,24,0.05)" : "transparent",
                  cursor: "pointer", color: "#fff", textTransform: "capitalize"
                }}>
                {m === "card" ? "💳" : m === "paypal" ? "🅿️" : "👛"} {m}
              </div>
            ))}
            {payment.method === "card" && (
              <input
                placeholder="Last 4 digits of card"
                maxLength={4}
                value={payment.cardLast4}
                onChange={e => setPayment({ ...payment, cardLast4: e.target.value })}
                style={{
                  width: "100%", padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", color: "#fff",
                  fontSize: "14px", outline: "none",
                  boxSizing: "border-box", marginTop: "8px"
                }}
              />
            )}
            <button onClick={() => setStep(3)} style={{
              width: "100%", padding: "14px", marginTop: "16px",
              background: "#F5C518", color: "#0A0F2C",
              border: "none", borderRadius: "10px",
              fontWeight: "700", cursor: "pointer"
            }}>Continue →</button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(245,197,24,0.15)",
            borderRadius: "16px", padding: "32px"
          }}>
            <h2 style={{ color: "#fff", marginBottom: "24px" }}>Confirm Order</h2>
            <div style={{ color: "#8892A4", fontSize: "14px", marginBottom: "8px" }}>
              📍 {address}
            </div>
            <div style={{ color: "#8892A4", fontSize: "14px", marginBottom: "24px" }}>
              💳 {payment.method} {payment.cardLast4 && `****${payment.cardLast4}`}
            </div>
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "20px", marginBottom: "24px",
              display: "flex", justifyContent: "space-between"
            }}>
              <span style={{ color: "#fff", fontWeight: "700" }}>Total</span>
              <span style={{ color: "#F5C518", fontWeight: "700", fontSize: "22px" }}>
                £{cart.total?.toFixed(2)}
              </span>
            </div>
            <button onClick={handlePlaceOrder} disabled={loading} style={{
              width: "100%", padding: "16px",
              background: "#F5C518", color: "#0A0F2C",
              border: "none", borderRadius: "10px",
              fontWeight: "700", fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? "Processing..." : "Place Order & Pay"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
