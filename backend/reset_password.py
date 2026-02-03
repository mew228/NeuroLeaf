import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Security setup (matching your app's config)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def reset_user_password(email: str, new_password: str):
    # Ensure we use the async driver
    if DATABASE_URL.startswith("postgresql://"):
        url = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    else:
        url = DATABASE_URL

    engine = create_async_engine(url)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    hashed_password = pwd_context.hash(new_password)
    
    async with async_session() as session:
        # Update the password for the specific email
        query = text("UPDATE users SET hashed_password = :password WHERE email = :email")
        result = await session.execute(query, {"password": hashed_password, "email": email})
        await session.commit()
        
        if result.rowcount > 0:
            print(f"✅ Success! Password for {email} has been reset.")
            print(f"🔑 Your new temporary password is: {new_password}")
        else:
            print(f"❌ Error: User with email {email} not found in the database.")
    
    await engine.dispose()

if __name__ == "__main__":
    target_email = "mewmaharshi288@gmail.com"
    temp_password = "NeuroLeaf2026!"
    asyncio.run(reset_user_password(target_email, temp_password))
