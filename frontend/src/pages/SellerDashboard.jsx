import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { sellerAPI, productAPI } from "../api";

export default function SellerDashboard() {
  const { seller } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [products,  setProducts]  = useState([]);
  const [showForm,  setShowForm]  = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (seller) { loadDashboard(); loadProducts(); }
  }, [seller]);

  const loadDashboard = async () => {
    try { const res = await sellerAPI.dashboard(); setDashboard(res.data.dashboard); } catch {}
  };

  const loadProducts = async () => {
    try {
      const res = await productAPI.list({ seller_id: seller?.id });
      setProducts(res.data.products || []);
    } catch {}
  };

  const handleAddProduct = async (e) => {
    e.preventDefault(); setLoading(true); setMsg("");
    try {
      await productAPI.create({
        ...form,
        price:      parseFloat(form.price),
        stock:      parseInt(form.stock),
        sellerId:   seller.id,
        sellerName: seller.storeName,
        images:     [],
      });
      setMsg("Product listed successfully!");
      setForm({ name: "", description: "", price: "", category: "", stock: "" });
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setMsg(err.response?.data?.detail || "Failed to add product.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "36px", marginBottom: "8px" }}>
        Seller Dashboard
      </h1>
      <p style={{ color: "#F5C518", marginBottom: "32px" }}>{dashboard?.storeName}</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {[
          { label: "Total Products", value: products.length, icon: "📦" },
          { label: "Total Sales",    value: `£${dashboard?.totalSales || 0}`, icon: "💰" },
          { label: "Rating",         value: `${dashboard?.rating || 0}/5`, icon: "⭐" },
          { label: "Status",         value: dashboard?.status || "pending", icon: "🏪" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(245,197,24,0.15)",
            borderRadius: "14px", padding: "24px"
          }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ color: "#F5C518", fontSize: "24px", fontWeight: "700" }}>{stat.value}</div>
            <div style={{ color: "#8892A4", fontSize: "13px", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add Product */}
      <div style={{ marginBottom: "32px" }}>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: "#F5C518", color: "#0A0F2C",
          border: "none", padding: "12px 24px",
          borderRadius: "10px", fontWeight: "700",
          cursor: "pointer", fontSize: "14px"
        }}>
          {showForm ? "Cancel" : "+ List New Product"}
        </button>
      </div>

      {msg && (
        <div style={{
          background: msg.includes("success") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${msg.includes("success") ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          color: msg.includes("success") ? "#22c55e" : "#ef4444",
          padding: "12px", borderRadius: "10px", marginBottom: "20px", fontSize: "13px"
        }}>{msg}</div>
      )}

      {showForm && (
        <form onSubmit={handleAddProduct} style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", padding: "32px", marginBottom: "32px", maxWidth: "500px"
        }}>
          <h2 style={{ color: "#fff", marginBottom: "24px" }}>New Product</h2>
          {[
            { key: "name",        label: "Product Name",  type: "text" },
            { key: "category",    label: "Category",      type: "text" },
            { key: "price",       label: "Price (£)",     type: "number" },
            { key: "stock",       label: "Stock",         type: "number" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: "16px" }}>
              <label style={{ color: "#8892A4", fontSize: "13px", display: "block", marginBottom: "6px" }}>{f.label}</label>
              <input
                type={f.type} value={form[f.key]} required
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px", color: "#fff", fontSize: "14px",
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>
          ))}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#8892A4", fontSize: "13px", display: "block", marginBottom: "6px" }}>Description</label>
            <textarea
              value={form.description} required rows={3}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{
                width: "100%", padding: "10px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", color: "#fff", fontSize: "14px",
                outline: "none", resize: "none", boxSizing: "border-box"
              }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "12px",
            background: "#F5C518", color: "#0A0F2C",
            border: "none", borderRadius: "8px",
            fontWeight: "700", cursor: "pointer"
          }}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      )}

      {/* Products list */}
      <h2 style={{ color: "#fff", fontSize: "22px", marginBottom: "20px" }}>
        Your Products ({products.length})
      </h2>
      {products.length === 0 ? (
        <p style={{ color: "#8892A4" }}>No products listed yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {products.map(p => (
            <div key={p.id} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px", padding: "20px"
            }}>
              <div style={{ color: "#F5C518", fontSize: "11px", letterSpacing: "1px", marginBottom: "8px" }}>
                {p.category?.toUpperCase()}
              </div>
              <h3 style={{ color: "#fff", fontSize: "15px", marginBottom: "8px" }}>{p.name}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <span style={{ color: "#F5C518", fontWeight: "700" }}>£{p.price}</span>
                <span style={{ color: "#8892A4", fontSize: "13px" }}>Stock: {p.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
