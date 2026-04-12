import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await userAPI.register(form);
      loginUser(res.data.user, res.data.token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
    setLoading(false);
  };

  const fields = [
    { key: "name",     label: "Full Name",      type: "text" },
    { key: "email",    label: "Email",           type: "email" },
    { key: "password", label: "Password",        type: "password" },
  ];

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
            Create account
          </h1>
          <p style={{ color: "#8892A4", marginTop: "8px", fontSize: "14px" }}>
            Join the Vaultex marketplace
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
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: "20px" }}>
              <label style={{ color: "#8892A4", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ color: "#8892A4", textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#F5C518", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
