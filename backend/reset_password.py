import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from passlib.context import CryptContext

DATABASE_URL = "postgresql+asyncpg://neuroleaf_user:neuroleaf2026@localhost:5432/neuroleaf_db"
EMAIL = "mewmaharshi288@gmail.com"
NEW_PASSWORD = "NeuroLeaf2026!"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def reset_password():
    password_hash = pwd_context.hash(NEW_PASSWORD)
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.connect() as conn:
        result = await conn.execute(
            text("UPDATE users SET password_hash = :hash WHERE email = :email"),
            {"hash": password_hash, "email": EMAIL}
        )
        await conn.commit()
        
        if result.rowcount > 0:
            print(f"Successfully reset password for {EMAIL}")
        else:
            print(f"User {EMAIL} not found.")
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(reset_password())
