from fastapi import APIRouter, Query
from src.models.product import ProductCreate, ProductUpdate
from src.controllers.product_controller import (
    create_product, get_products, get_product,
    update_product, delete_product, get_categories
)

router = APIRouter()


# GET /categories
@router.get("/categories")
async def categories():
    return await get_categories()


# GET /  — list all products with filters
@router.get("/")
async def list_products(
    category:  str = Query(None),
    seller_id: str = Query(None),
    search:    str = Query(None),
    page:      int = Query(1, ge=1),
    limit:     int = Query(20, ge=1, le=100),
):
    return await get_products(category, seller_id, search, page, limit)


# GET /{id}  — single product
@router.get("/{product_id}")
async def single_product(product_id: str):
    return await get_product(product_id)


# POST /  — create product
@router.post("/", status_code=201)
async def new_product(data: ProductCreate):
    return await create_product(data)


# PUT /{id}  — update product
@router.put("/{product_id}")
async def edit_product(product_id: str, seller_id: str, data: ProductUpdate):
    return await update_product(product_id, seller_id, data)


# DELETE /{id}  — soft delete
@router.delete("/{product_id}")
async def remove_product(product_id: str, seller_id: str):
    return await delete_product(product_id, seller_id)
