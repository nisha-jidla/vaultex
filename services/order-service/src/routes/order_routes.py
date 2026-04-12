from fastapi import APIRouter, Query
from src.models.order import OrderCreate, OrderStatusUpdate
from src.controllers.order_controller import (
    create_order, get_order, get_user_orders,
    update_order_status, cancel_order
)

router = APIRouter()


# POST /  — place order
@router.post("/", status_code=201)
def place_order(data: OrderCreate):
    return create_order(data)


# GET /user/{user_id}  — get all orders for a user
@router.get("/user/{user_id}")
def user_orders(user_id: str):
    return get_user_orders(user_id)


# GET /{order_id}  — single order
@router.get("/{order_id}")
def single_order(order_id: str):
    return get_order(order_id)


# PUT /{order_id}/status  — update status
@router.put("/{order_id}/status")
def update_status(order_id: str, data: OrderStatusUpdate):
    return update_order_status(order_id, data)


# DELETE /{order_id}  — cancel order
@router.delete("/{order_id}")
def cancel(order_id: str, user_id: str = Query(...)):
    return cancel_order(order_id, user_id)
