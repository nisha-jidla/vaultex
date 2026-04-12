from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime, timezone
from src.database import products_col, product_to_dict
from src.models.product import ProductCreate, ProductUpdate


# ── Create product ─────────────────────────────────────────────
async def create_product(data: ProductCreate):
    doc = {
        "name":         data.name.strip(),
        "description":  data.description.strip(),
        "price":        round(data.price, 2),
        "category":     data.category.strip().lower(),
        "stock":        data.stock,
        "images":       data.images,
        "sellerId":     data.sellerId,
        "sellerName":   data.sellerName,
        "rating":       0.0,
        "totalReviews": 0,
        "isActive":     True,
        "createdAt":    datetime.now(timezone.utc).isoformat(),
        "updatedAt":    datetime.now(timezone.utc).isoformat(),
    }
    result = await products_col.insert_one(doc)
    created = await products_col.find_one({"_id": result.inserted_id})
    return product_to_dict(created)


# ── Get all products (with optional filters) ───────────────────
async def get_products(category: str = None, seller_id: str = None,
                       search: str = None, page: int = 1, limit: int = 20):
    query = {"isActive": True}

    if category:   query["category"]  = category.lower()
    if seller_id:  query["sellerId"]  = seller_id
    if search:     query["$text"]     = {"$search": search}

    skip     = (page - 1) * limit
    cursor   = products_col.find(query).skip(skip).limit(limit)
    products = []
    async for p in cursor:
        products.append(product_to_dict(p))

    total = await products_col.count_documents(query)

    return {
        "products": products,
        "total":    total,
        "page":     page,
        "pages":    (total + limit - 1) // limit,
    }


# ── Get single product ─────────────────────────────────────────
async def get_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID.")

    product = await products_col.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    return product_to_dict(product)


# ── Update product ─────────────────────────────────────────────
async def update_product(product_id: str, seller_id: str, data: ProductUpdate):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID.")

    product = await products_col.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    # Only the seller who owns it can update
    if product["sellerId"] != seller_id:
        raise HTTPException(status_code=403, detail="Not authorised to update this product.")

    updates = {k: v for k, v in data.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update.")

    updates["updatedAt"] = datetime.now(timezone.utc).isoformat()

    await products_col.update_one({"_id": ObjectId(product_id)}, {"$set": updates})
    updated = await products_col.find_one({"_id": ObjectId(product_id)})
    return product_to_dict(updated)


# ── Delete product (soft delete) ───────────────────────────────
async def delete_product(product_id: str, seller_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID.")

    product = await products_col.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    if product["sellerId"] != seller_id:
        raise HTTPException(status_code=403, detail="Not authorised to delete this product.")

    await products_col.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"isActive": False, "updatedAt": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Product deleted successfully."}


# ── Get products by category ───────────────────────────────────
async def get_categories():
    categories = await products_col.distinct("category", {"isActive": True})
    return {"categories": sorted(categories)}
