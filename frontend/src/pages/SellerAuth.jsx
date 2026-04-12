import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sellerAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export function SellerLogin() {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { loginSeller } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await sellerAPI.login(form);
      loginSeller(res.data.seller, res.data.token);
      navigate("/seller/dashboard");
    } catch (err) { setError(err.response?.data?.error || "Login failed."); }
    setLoading(false);
  };

  return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: "20px", padding: "48px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "52px", height: "52px", background: "#F5C518", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px", fontWeight: "900", color: "#0A0F2C" }}>🏪</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "26px" }}>Seller Login</h1>
        </div>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px", borderRadius: "10px", fontSize: "13px", marginBottom: "20px" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {["email", "password"].map(f => (
            <div key={f} style={{ marginBottom: "16px" }}>
              <label style={{ color: "#8892A4", fontSize: "13px", display: "block", marginBottom: "6px" }}>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
              <input type={f === "password" ? "password" : "email"} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} required
                style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: "#F5C518", color: "#0A0F2C", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", marginTop: "8px" }}>
            {loading ? "Signing in..." : "Sign In as Seller"}
          </button>
        </form>
        <p style={{ color: "#8892A4", textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
          New seller? <Link to="/seller/register" style={{ color: "#F5C518", textDecoration: "none" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

export function SellerRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "", storeName: "", storeDescription: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginSeller } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await sellerAPI.register(form);
      loginSeller(res.data.seller, res.data.token);
      navigate("/seller/dashboard");
    } catch (err) { setError(err.response?.data?.error || "Registration failed."); }
    setLoading(false);
  };

  const fields = [
    { key: "name", label: "Your Name", type: "text" },
    { key: "storeName", label: "Store Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "password", label: "Password", type: "password" },
    { key: "storeDescription", label: "Store Description (optional)", type: "text" },
  ];

  return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: "20px", padding: "48px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "52px", height: "52px", background: "#F5C518", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px", fontWeight: "900", color: "#0A0F2C" }}>🏪</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "26px" }}>Become a Seller</h1>
        </div>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px", borderRadius: "10px", fontSize: "13px", marginBottom: "20px" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: "16px" }}>
              <label style={{ color: "#8892A4", fontSize: "13px", display: "block", marginBottom: "6px" }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required={f.key !== "storeDescription"}
                style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: "#F5C518", color: "#0A0F2C", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", marginTop: "8px" }}>
            {loading ? "Creating..." : "Create Seller Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
