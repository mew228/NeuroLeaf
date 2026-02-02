"""
Redis Caching Service for NeuroLeaf
Provides high-performance caching for frequently accessed data.
"""

import json
import logging
from typing import Any, Optional
from datetime import timedelta

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class CacheService:
    """
    Redis-based caching service with fallback to in-memory cache.
    """
    
    def __init__(self):
        self._redis_client: Optional[redis.Redis] = None
        self._memory_cache: dict = {}
        self._initialize_redis()
    
    def _initialize_redis(self):
        """Initialize Redis connection."""
        if not REDIS_AVAILABLE:
            logger.warning("Redis package not installed. Using in-memory cache.")
            return
        
        redis_url = getattr(settings, 'REDIS_URL', None)
        if not redis_url:
            logger.warning("REDIS_URL not configured. Using in-memory cache.")
            return
        
        try:
            self._redis_client = redis.from_url(
                redis_url,
                decode_responses=True,
                socket_timeout=5,
                socket_connect_timeout=5,
            )
            # Test connection
            self._redis_client.ping()
            logger.info("Redis cache initialized successfully")
        except redis.RedisError as e:
            logger.warning(f"Redis connection failed: {e}. Falling back to in-memory cache.")
            self._redis_client = None
    
    def _make_key(self, namespace: str, key: str) -> str:
        """Create a namespaced cache key."""
        return f"neuroleaf:{namespace}:{key}"
    
    async def get(self, namespace: str, key: str) -> Optional[Any]:
        """
        Retrieve a value from cache.
        
        Args:
            namespace: Cache namespace (e.g., 'dashboard', 'user')
            key: Unique key within namespace
            
        Returns:
            Cached value or None if not found
        """
        cache_key = self._make_key(namespace, key)
        
        if self._redis_client:
            try:
                value = self._redis_client.get(cache_key)
                if value:
                    return json.loads(value)
            except redis.RedisError as e:
                logger.error(f"Redis GET error: {e}")
        
        # Fallback to memory cache
        return self._memory_cache.get(cache_key)
    
    async def set(
        self, 
        namespace: str, 
        key: str, 
        value: Any, 
        ttl_seconds: int = 300
    ) -> bool:
        """
        Store a value in cache.
        
        Args:
            namespace: Cache namespace
            key: Unique key within namespace
            value: Value to cache (must be JSON serializable)
            ttl_seconds: Time-to-live in seconds (default: 5 minutes)
            
        Returns:
            True if successfully cached
        """
        cache_key = self._make_key(namespace, key)
        serialized = json.dumps(value)
        
        if self._redis_client:
            try:
                self._redis_client.setex(cache_key, ttl_seconds, serialized)
                return True
            except redis.RedisError as e:
                logger.error(f"Redis SET error: {e}")
        
        # Fallback to memory cache (no TTL for simplicity)
        self._memory_cache[cache_key] = value
        return True
    
    async def delete(self, namespace: str, key: str) -> bool:
        """
        Delete a value from cache.
        
        Args:
            namespace: Cache namespace
            key: Unique key within namespace
            
        Returns:
            True if successfully deleted
        """
        cache_key = self._make_key(namespace, key)
        
        if self._redis_client:
            try:
                self._redis_client.delete(cache_key)
                return True
            except redis.RedisError as e:
                logger.error(f"Redis DELETE error: {e}")
        
        # Fallback to memory cache
        self._memory_cache.pop(cache_key, None)
        return True
    
    async def invalidate_namespace(self, namespace: str) -> int:
        """
        Invalidate all keys in a namespace.
        
        Args:
            namespace: Cache namespace to clear
            
        Returns:
            Number of keys deleted
        """
        pattern = self._make_key(namespace, "*")
        deleted = 0
        
        if self._redis_client:
            try:
                keys = self._redis_client.keys(pattern)
                if keys:
                    deleted = self._redis_client.delete(*keys)
                return deleted
            except redis.RedisError as e:
                logger.error(f"Redis invalidate error: {e}")
        
        # Fallback to memory cache
        prefix = self._make_key(namespace, "")
        keys_to_delete = [k for k in self._memory_cache if k.startswith(prefix)]
        for k in keys_to_delete:
            del self._memory_cache[k]
        return len(keys_to_delete)


# Cache TTL constants (in seconds)
class CacheTTL:
    DASHBOARD_SUMMARY = 300      # 5 minutes
    USER_PROFILE = 900           # 15 minutes
    MOOD_HISTORY = 600           # 10 minutes
    JOURNAL_LIST = 300           # 5 minutes
    AI_EMBEDDINGS = 3600         # 1 hour
    ANALYTICS_STATS = 1800       # 30 minutes


# Singleton instance
cache_service = CacheService()
