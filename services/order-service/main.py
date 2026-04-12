from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.routes.order_routes import router
from src.database import create_tables
import time, pymysql, os


def wait_for_mysql(retries=10, delay=5):
    for i in range(retries):
        try:
            conn = pymysql.connect(
                host=os.getenv("DB_HOST", "localhost"),
                user=os.getenv("DB_USER", "vaultex"),
                password=os.getenv("DB_PASSWORD", "vaultex_pass"),
                db=os.getenv("DB_NAME", "vaultex_orders"),
            )
            conn.close()
            print("✅ MySQL connected")
            return True
        except Exception as e:
            print(f"⏳ Waiting for MySQL... ({i+1}/{retries})")
            time.sleep(delay)
    return False


@asynccontextmanager
async def lifespan(app: FastAPI):
    wait_for_mysql()
    create_tables()
    yield
    print("👋 Order Service shutting down")


app = FastAPI(title="Vaultex Order Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"service": "order-service", "status": "ok"}

app.include_router(router)
