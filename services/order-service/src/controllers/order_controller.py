import uuid
from fastapi import HTTPException
from src.database import get_db
from src.models.order import OrderCreate, OrderStatusUpdate

VALID_STATUSES = {"pending", "confirmed", "shipped", "delivered", "cancelled"}


# ── POST / — place order ───────────────────────────────────────
def create_order(data: OrderCreate):
    if not data.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item.")

    order_id = str(uuid.uuid4())
    total    = sum(round(item.price * item.quantity, 2) for item in data.items)

    with get_db() as conn:
        with conn.cursor() as cur:
            # Insert order
            cur.execute("""
                INSERT INTO orders (id, user_id, status, total, address)
                VALUES (%s, %s, 'pending', %s, %s)
            """, (order_id, data.userId, total, data.address))

            # Insert order items
            for item in data.items:
                cur.execute("""
                    INSERT INTO order_items
                        (order_id, product_id, name, price, quantity, seller_id, seller_name)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (order_id, item.productId, item.name,
                      item.price, item.quantity, item.sellerId, item.sellerName))

    return {
        "message":  "Order placed successfully.",
        "orderId":  order_id,
        "userId":   data.userId,
        "total":    total,
        "status":   "pending",
        "items":    [i.dict() for i in data.items],
        "address":  data.address,
    }


# ── GET /{order_id} — get single order ────────────────────────
def get_order(order_id: str):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
            order = cur.fetchone()
            if not order:
                raise HTTPException(status_code=404, detail="Order not found.")

            cur.execute("SELECT * FROM order_items WHERE order_id = %s", (order_id,))
            items = cur.fetchall()

    order["items"] = items
    return order


# ── GET /user/{user_id} — get all orders for a user ───────────
def get_user_orders(user_id: str):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,)
            )
            orders = cur.fetchall()

            for order in orders:
                cur.execute(
                    "SELECT * FROM order_items WHERE order_id = %s",
                    (order["id"],)
                )
                order["items"] = cur.fetchall()

    return {"userId": user_id, "orders": orders, "total": len(orders)}


# ── PUT /{order_id}/status — update order status ──────────────
def update_order_status(order_id: str, data: OrderStatusUpdate):
    if data.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"
        )

    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM orders WHERE id = %s", (order_id,))
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="Order not found.")

            cur.execute(
                "UPDATE orders SET status = %s WHERE id = %s",
                (data.status, order_id)
            )

    return {"message": f"Order status updated to '{data.status}'.", "orderId": order_id, "status": data.status}


# ── DELETE /{order_id} — cancel order ─────────────────────────
def cancel_order(order_id: str, user_id: str):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM orders WHERE id = %s AND user_id = %s", (order_id, user_id))
            order = cur.fetchone()
            if not order:
                raise HTTPException(status_code=404, detail="Order not found.")
            if order["status"] not in ("pending", "confirmed"):
                raise HTTPException(status_code=400, detail="Only pending or confirmed orders can be cancelled.")

            cur.execute("UPDATE orders SET status = 'cancelled' WHERE id = %s", (order_id,))

    return {"message": "Order cancelled successfully.", "orderId": order_id}
