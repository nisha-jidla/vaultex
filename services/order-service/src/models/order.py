from pydantic import BaseModel
from typing import List, Optional


class OrderItem(BaseModel):
    productId:  str
    name:       str
    price:      float
    quantity:   int
    sellerId:   Optional[str] = ""
    sellerName: Optional[str] = ""


class OrderCreate(BaseModel):
    userId:  str
    items:   List[OrderItem]
    address: Optional[str] = ""


class OrderStatusUpdate(BaseModel):
    status: str  # pending | confirmed | shipped | delivered | cancelled
