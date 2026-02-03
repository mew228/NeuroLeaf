from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.utils.security import verify_token

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current user, falling back to a global Guest user for seamless access."""
    # Try to verify token if provided
    email = "guest@neuroleaf.com" # Default
    
    if credentials:
        token = credentials.credentials
        payload = verify_token(token)
        if payload and payload.get("sub"):
            email = payload.get("sub")

    # Get user from DB
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    # If Guest user doesn't exist yet, create it on the fly
    if user is None and email == "guest@neuroleaf.com":
        from app.utils.security import hash_password
        user = User(
            email=email,
            full_name="Guest User",
            password_hash=hash_password("guest-not-for-production-but-ok")
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    if user is None:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
        
    return user
