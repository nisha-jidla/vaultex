import { createContext, useContext, useState } from "react";
import { cartAPI } from "../api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });

  const fetchCart = async (userId) => {
    try {
      const res = await cartAPI.get(userId);
      setCart(res.data);
    } catch {}
  };

  const addToCart = async (userId, product) => {
    try {
      await cartAPI.add({
        userId,
        productId:  product.id,
        name:       product.name,
        price:      product.price,
        quantity:   1,
        image:      product.images?.[0] || "",
        sellerId:   product.sellerId,
        sellerName: product.sellerName,
      });
      await fetchCart(userId);
    } catch {}
  };

  const removeFromCart = async (userId, productId) => {
    try {
      await cartAPI.remove({ userId, productId });
      await fetchCart(userId);
    } catch {}
  };

  const clearCart = async (userId) => {
    try {
      await cartAPI.clear(userId);
      setCart({ items: [], total: 0, itemCount: 0 });
    } catch {}
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
