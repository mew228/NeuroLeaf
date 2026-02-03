import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def list_users():
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        result = await session.execute(text("SELECT email FROM users"))
        users = result.fetchall()
        print("Registered Users:")
        for user in users:
            print(f"- {user[0]}")
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(list_users())
