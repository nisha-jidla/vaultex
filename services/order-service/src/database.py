import pymysql
import os
from contextlib import contextmanager

DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "user":     os.getenv("DB_USER", "vaultex"),
    "password": os.getenv("DB_PASSWORD", "vaultex_pass"),
    "db":       os.getenv("DB_NAME", "vaultex_orders"),
    "charset":  "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,
}


def get_connection():
    return pymysql.connect(**DB_CONFIG)


@contextmanager
def get_db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def create_tables():
    """Create orders and order_items tables if they don't exist."""
    with get_db() as conn:
        with conn.cursor() as cur:
            # Orders table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS orders (
                    id          VARCHAR(36)  PRIMARY KEY,
                    user_id     VARCHAR(100) NOT NULL,
                    status      ENUM('pending','confirmed','shipped','delivered','cancelled')
                                DEFAULT 'pending',
                    total       DECIMAL(10,2) NOT NULL,
                    address     TEXT,
                    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            """)

            # Order items table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS order_items (
                    id          INT AUTO_INCREMENT PRIMARY KEY,
                    order_id    VARCHAR(36)  NOT NULL,
                    product_id  VARCHAR(100) NOT NULL,
                    name        VARCHAR(255) NOT NULL,
                    price       DECIMAL(10,2) NOT NULL,
                    quantity    INT NOT NULL,
                    seller_id   VARCHAR(100),
                    seller_name VARCHAR(255),
                    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
                )
            """)
    print("✅ MySQL tables ready")
