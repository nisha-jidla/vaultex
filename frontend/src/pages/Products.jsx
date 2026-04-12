import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { productAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Products() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [added, setAdded] = useState({});

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.list({ category, search });
      setProducts(res.data.products || []);
    } catch { setProducts([]); }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const res = await productAPI.categories();
      setCategories(res.data.categories || []);
    } catch {}
  };

  const handleAddToCart = async (product) => {
    if (!user) return alert("Please login to add items to cart.");
    await addToCart(user.id, product);
    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  return (
    <div style={{ background: "#0A0F2C", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "36px", marginBottom: "8px" }}>
        {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
      </h1>
      <p style={{ color: "#8892A4", marginBottom: "32px" }}>
        {products.length} products available
      </p>

      {/* Search */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && loadProducts()}
          placeholder="Search products..."
          style={{
            flex: 1, padding: "12px 20px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", color: "#fff", fontSize: "14px",
            outline: "none"
          }}
        />
        <button onClick={loadProducts} style={{
          background: "#F5C518", color: "#0A0F2C",
          border: "none", padding: "12px 24px",
          borderRadius: "10px", fontWeight: "700", cursor: "pointer"
        }}>Search</button>
      </div>

      {/* Categories filter */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px" }}>
        <Link to="/products" style={{
          padding: "6px 16px", borderRadius: "999px", fontSize: "13px",
          textDecoration: "none",
          background: !category ? "#F5C518" : "rgba(255,255,255,0.05)",
          color: !category ? "#0A0F2C" : "#8892A4",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>All</Link>
        {categories.map(cat => (
          <Link key={cat} to={`/products?category=${cat}`} style={{
            padding: "6px 16px", borderRadius: "999px", fontSize: "13px",
            textDecoration: "none",
            background: category === cat ? "#F5C518" : "rgba(255,255,255,0.05)",
            color: category === cat ? "#0A0F2C" : "#8892A4",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>{cat}</Link>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div style={{ color: "#8892A4", textAlign: "center", padding: "60px" }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ color: "#8892A4", textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
          <p>No products found. Be the first to list one!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {products.map(product => (
            <div key={product.id} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", overflow: "hidden",
              transition: "transform 0.2s",
            }}>
              {/* Product image placeholder */}
              <div style={{
                height: "200px", background: "linear-gradient(135deg, #1a2040, #0d1530)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "48px"
              }}>📦</div>

              <div style={{ padding: "20px" }}>
                <div style={{ color: "#F5C518", fontSize: "11px", letterSpacing: "1px", marginBottom: "8px" }}>
                  {product.category?.toUpperCase()}
                </div>
                <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "8px", fontWeight: "600" }}>
                  {product.name}
                </h3>
                <p style={{ color: "#8892A4", fontSize: "13px", marginBottom: "16px", lineHeight: "1.5" }}>
                  {product.description?.substring(0, 80)}...
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#F5C518", fontSize: "22px", fontWeight: "700" }}>
                    £{product.price?.toFixed(2)}
                  </span>
                  <span style={{ color: "#8892A4", fontSize: "12px" }}>
                    Stock: {product.stock}
                  </span>
                </div>

                <div style={{ color: "#8892A4", fontSize: "12px", marginTop: "8px", marginBottom: "16px" }}>
                  by {product.sellerName}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    width: "100%", padding: "12px",
                    background: added[product.id] ? "#22c55e" : "#F5C518",
                    color: "#0A0F2C", border: "none",
                    borderRadius: "10px", fontWeight: "700",
                    cursor: "pointer", fontSize: "14px",
                    transition: "background 0.3s"
                  }}>
                  {added[product.id] ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
