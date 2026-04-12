import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../api";

const STATUS_COLORS = {
  pending:   { bg: "rgba(245,197,24,0.1)",  text: "#F5C518",  label: "Pending" },
  confirmed: { bg: "rgba(59,130,246,0.1)",  text: "#3b82f6",  label: "Confirmed" },
  shipped:   { bg: "rgba(168,85,247,0.1)",  text: "#a855f7",  label: "Shipped" },
  delivered: { bg: "rgba(34,197,94,0.1)",   text: "#22c55e",  label: "Delivered" },
  cancelled: { bg: "rgba(239,68,68,0.1)",   text: "#ef4444",  label: "Cancelled" },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.userOrders(user.id);
      setOrders(res.data.orders || []);
    } catch { setOrders([]); }
    setLoading(false);
  };

  if (loading) return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#8892A4" }}>Loading orders...</p>
    </div>
  );

  return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "36px", marginBottom: "32px" }}>
        Your Orders
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📋</div>
          <p style={{ color: "#8892A4", fontSize: "18px" }}>No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div style={{ maxWidth: "800px" }}>
          {orders.map(order => {
            const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            return (
              <div key={order.id} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px", padding: "24px",
                marginBottom: "16px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <div style={{ color: "#8892A4", fontSize: "12px", marginBottom: "4px" }}>ORDER ID</div>
                    <div style={{ color: "#fff", fontSize: "14px", fontFamily: "monospace" }}>
                      {order.id?.substring(0, 18)}...
                    </div>
                  </div>
                  <div style={{
                    background: s.bg, color: s.text,
                    padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600"
                  }}>{s.label}</div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#8892A4", fontSize: "13px" }}>
                  <span>{order.items?.length || 0} item(s)</span>
                  <span style={{ color: "#F5C518", fontWeight: "700", fontSize: "18px" }}>
                    £{parseFloat(order.total).toFixed(2)}
                  </span>
                </div>

                {order.address && (
                  <div style={{ color: "#8892A4", fontSize: "12px", marginTop: "12px" }}>
                    📍 {order.address}
                  </div>
                )}

                <div style={{ color: "#8892A4", fontSize: "12px", marginTop: "8px" }}>
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
