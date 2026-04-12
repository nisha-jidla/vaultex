from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os


MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/vaultex_products")
client    = AsyncIOMotorClient(MONGO_URI)
db        = client.get_default_database()

products_col = db["products"]


def product_to_dict(p: dict) -> dict:
    """Convert MongoDB document to clean dict."""
    p["id"] = str(p["_id"])
    del p["_id"]
    return p


async def create_indexes():
    """Create search indexes on startup."""
    await products_col.create_index("category")
    await products_col.create_index("sellerId")
    await products_col.create_index("name")
    await products_col.create_index([("name", "text"), ("description", "text")])
