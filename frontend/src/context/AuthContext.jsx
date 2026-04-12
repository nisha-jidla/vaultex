import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,   setUser]   = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser   = localStorage.getItem("vaultex_user");
    const savedSeller = localStorage.getItem("vaultex_seller");
    if (savedUser)   setUser(JSON.parse(savedUser));
    if (savedSeller) setSeller(JSON.parse(savedSeller));
    setLoading(false);
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem("vaultex_token",  token);
    localStorage.setItem("vaultex_user",   JSON.stringify(userData));
    setUser(userData);
  };

  const loginSeller = (sellerData, token) => {
    localStorage.setItem("vaultex_token",  token);
    localStorage.setItem("vaultex_seller", JSON.stringify(sellerData));
    setSeller(sellerData);
  };

  const logout = () => {
    localStorage.removeItem("vaultex_token");
    localStorage.removeItem("vaultex_user");
    localStorage.removeItem("vaultex_seller");
    setUser(null);
    setSeller(null);
  };

  return (
    <AuthContext.Provider value={{ user, seller, loading, loginUser, loginSeller, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
