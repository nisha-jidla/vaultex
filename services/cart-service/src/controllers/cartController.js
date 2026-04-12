const redis = require("../redis");
const CART_TTL = 60 * 60 * 24 * 7;

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartData = await redis.hgetall(`cart:${userId}`);
    if (!cartData || Object.keys(cartData).length === 0) {
      return res.status(200).json({ userId, items: [], total: 0, itemCount: 0 });
    }
    const items = Object.values(cartData).map((i) => JSON.parse(i));
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    res.status(200).json({ userId, items, total: parseFloat(total.toFixed(2)), itemCount });
  } catch (err) { res.status(500).json({ error: "Error fetching cart." }); }
};

const addToCart = async (req, res) => {
  try {
    const { userId, productId, name, price, quantity = 1, image = "", sellerId = "", sellerName = "" } = req.body;
    if (!userId || !productId || !name || !price) return res.status(400).json({ error: "userId, productId, name and price required." });
    const cartKey = `cart:${userId}`;
    const existingRaw = await redis.hget(cartKey, productId);
    let cartItem = existingRaw ? { ...JSON.parse(existingRaw), quantity: JSON.parse(existingRaw).quantity + quantity }
      : { productId, name, price: parseFloat(price), quantity, image, sellerId, sellerName, addedAt: new Date().toISOString() };
    await redis.hset(cartKey, productId, JSON.stringify(cartItem));
    await redis.expire(cartKey, CART_TTL);
    res.status(200).json({ message: "Item added to cart.", item: cartItem });
  } catch (err) { res.status(500).json({ error: "Error adding to cart." }); }
};

const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity) return res.status(400).json({ error: "userId, productId and quantity required." });
    const cartKey = `cart:${userId}`;
    const existingRaw = await redis.hget(cartKey, productId);
    if (!existingRaw) return res.status(404).json({ error: "Item not found in cart." });
    const cartItem = { ...JSON.parse(existingRaw), quantity };
    await redis.hset(cartKey, productId, JSON.stringify(cartItem));
    await redis.expire(cartKey, CART_TTL);
    res.status(200).json({ message: "Cart updated.", item: cartItem });
  } catch (err) { res.status(500).json({ error: "Error updating cart." }); }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: "userId and productId required." });
    await redis.hdel(`cart:${userId}`, productId);
    res.status(200).json({ message: "Item removed from cart." });
  } catch (err) { res.status(500).json({ error: "Error removing from cart." }); }
};

const clearCart = async (req, res) => {
  try {
    await redis.del(`cart:${req.params.userId}`);
    res.status(200).json({ message: "Cart cleared." });
  } catch (err) { res.status(500).json({ error: "Error clearing cart." }); }
};

const getCartCount = async (req, res) => {
  try {
    const cartData = await redis.hgetall(`cart:${req.params.userId}`);
    const itemCount = cartData ? Object.values(cartData).reduce((sum, i) => sum + JSON.parse(i).quantity, 0) : 0;
    res.status(200).json({ userId: req.params.userId, itemCount });
  } catch (err) { res.status(500).json({ error: "Error fetching count." }); }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount };
