import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os

DATABASE_URL = "postgresql+asyncpg://neuroleaf_user:neuroleaf2026@localhost:5432/neuroleaf_db"

async def check_users():
    engine = create_async_engine(DATABASE_URL)
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT email FROM users"))
        users = result.fetchall()
        print("Registered Users:")
        for user in users:
            print(f"- {user[0]}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_users())
