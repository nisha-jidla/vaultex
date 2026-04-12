from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.routes.product_routes import router
from src.database import create_indexes
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_indexes()
    print("✅ MongoDB indexes created")
    yield
    print("👋 Product Service shutting down")


app = FastAPI(title="Vaultex Product Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"service": "product-service", "status": "ok"}

app.include_router(router)
