import { Link } from "react-router-dom";

export default function Home() {
  const categories = [
    { name: "Electronics", emoji: "💻" },
    { name: "Fashion",     emoji: "👗" },
    { name: "Shoes",       emoji: "👟" },
    { name: "Home",        emoji: "🏠" },
    { name: "Sports",      emoji: "⚽" },
    { name: "Beauty",      emoji: "💄" },
  ];

  return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{
        padding: "100px 4rem",
        background: "linear-gradient(135deg, #0A0F2C 0%, #0d1540 50%, #0A0F2C 100%)",
        borderBottom: "1px solid rgba(245,197,24,0.1)",
        position: "relative", overflow: "hidden"
      }}>
        {/* Background decorative circle */}
        <div style={{
          position: "absolute", right: "-100px", top: "-100px",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />

        <div style={{ maxWidth: "700px", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(245,197,24,0.1)",
            border: "1px solid rgba(245,197,24,0.3)",
            color: "#F5C518", padding: "6px 16px",
            borderRadius: "999px", fontSize: "12px",
            letterSpacing: "2px", marginBottom: "24px"
          }}>
            EVERYTHING. ELEVATED.
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: "700", color: "#fff",
            lineHeight: "1.1", marginBottom: "24px"
          }}>
            The Premium<br />
            <span style={{ color: "#F5C518" }}>Marketplace</span><br />
            for Everything.
          </h1>

          <p style={{ color: "#8892A4", fontSize: "18px", marginBottom: "40px", lineHeight: "1.7" }}>
            Buy from verified sellers. Sell to millions of buyers.<br />
            Built different. Built better.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/products" style={{
              background: "#F5C518", color: "#0A0F2C",
              padding: "16px 36px", borderRadius: "12px",
              textDecoration: "none", fontSize: "16px",
              fontWeight: "700", letterSpacing: "0.5px"
            }}>
              Shop Now →
            </Link>
            <Link to="/seller/register" style={{
              background: "transparent",
              border: "1px solid rgba(245,197,24,0.4)",
              color: "#F5C518", padding: "16px 36px",
              borderRadius: "12px", textDecoration: "none",
              fontSize: "16px"
            }}>
              Become a Seller
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "80px 4rem" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          color: "#fff", fontSize: "36px",
          marginBottom: "8px"
        }}>Shop by Category</h2>
        <p style={{ color: "#8892A4", marginBottom: "40px" }}>Find exactly what you're looking for</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
          {categories.map(cat => (
            <Link key={cat.name} to={`/products?category=${cat.name.toLowerCase()}`}
              style={{ textDecoration: "none" }}>
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px", padding: "32px 16px",
                textAlign: "center", cursor: "pointer",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = "1px solid rgba(245,197,24,0.4)";
                  e.currentTarget.style.background = "rgba(245,197,24,0.05)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>{cat.emoji}</div>
                <div style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        padding: "60px 4rem",
        background: "rgba(245,197,24,0.03)",
        borderTop: "1px solid rgba(245,197,24,0.1)",
        borderBottom: "1px solid rgba(245,197,24,0.1)",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "40px", textAlign: "center"
      }}>
        {[
          { value: "10K+", label: "Products Listed" },
          { value: "500+", label: "Verified Sellers" },
          { value: "50K+", label: "Happy Buyers" },
          { value: "99.9%", label: "Uptime" },
        ].map(stat => (
          <div key={stat.label}>
            <div style={{ color: "#F5C518", fontSize: "40px", fontWeight: "700", fontFamily: "'Playfair Display', serif" }}>
              {stat.value}
            </div>
            <div style={{ color: "#8892A4", fontSize: "14px", marginTop: "8px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "40px 4rem", textAlign: "center" }}>
        <p style={{ color: "#8892A4", fontSize: "13px" }}>
          © 2026 Vaultex — Everything. Elevated. Built with ❤️
        </p>
      </div>
    </div>
  );
}
