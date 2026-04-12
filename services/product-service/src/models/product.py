from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ProductCreate(BaseModel):
    name:        str
    description: str
    price:       float
    category:    str
    stock:       int = 0
    images:      List[str] = []
    sellerId:    str
    sellerName:  str


class ProductUpdate(BaseModel):
    name:        Optional[str] = None
    description: Optional[str] = None
    price:       Optional[float] = None
    category:    Optional[str] = None
    stock:       Optional[int] = None
    images:      Optional[List[str]] = None


class ProductResponse(BaseModel):
    id:          str
    name:        str
    description: str
    price:       float
    category:    str
    stock:       int
    images:      List[str]
    sellerId:    str
    sellerName:  str
    rating:      float
    totalReviews:int
    isActive:    bool
    createdAt:   str
