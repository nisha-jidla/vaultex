import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await userAPI.login(form);
      loginUser(res.data.user, res.data.token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: "#0A0F2C", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "40px"
    }}>
      <div style={{
        width: "100%", maxWidth: "420px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(245,197,24,0.15)",
        borderRadius: "20px", padding: "48px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "52px", height: "52px", background: "#F5C518",
            borderRadius: "12px", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 16px",
            fontSize: "24px", fontWeight: "900", color: "#0A0F2C"
          }}>V</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "28px" }}>
            Welcome back
          </h1>
          <p style={{ color: "#8892A4", marginTop: "8px", fontSize: "14px" }}>
            Sign in to your Vaultex account
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", padding: "12px 16px", borderRadius: "10px",
            fontSize: "13px", marginBottom: "20px"
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {["email", "password"].map(field => (
            <div key={field} style={{ marginBottom: "20px" }}>
              <label style={{ color: "#8892A4", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "password" ? "password" : "email"}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                required
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", color: "#fff",
                  fontSize: "14px", outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px",
            background: "#F5C518", color: "#0A0F2C",
            border: "none", borderRadius: "10px",
            fontWeight: "700", fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1, marginTop: "8px"
          }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ color: "#8892A4", textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#F5C518", textDecoration: "none" }}>Sign up</Link>
        </p>
        <p style={{ color: "#8892A4", textAlign: "center", marginTop: "8px", fontSize: "14px" }}>
          Are you a seller?{" "}
          <Link to="/seller/login" style={{ color: "#F5C518", textDecoration: "none" }}>Seller login</Link>
        </p>
      </div>
    </div>
  );
}
