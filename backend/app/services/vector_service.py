"""
Vector Database Service using ChromaDB
Provides semantic search and RAG capabilities for long-term emotional pattern recognition.
"""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

try:
    import chromadb
    from chromadb.config import Settings as ChromaSettings
    CHROMA_AVAILABLE = True
except ImportError:
    CHROMA_AVAILABLE = False

from openai import OpenAI
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class VectorService:
    """
    ChromaDB-based vector storage for semantic search over journal entries.
    Enables RAG (Retrieval-Augmented Generation) for contextual AI responses.
    """
    
    COLLECTION_NAME = "journal_embeddings"
    EMBEDDING_MODEL = "text-embedding-3-small"
    EMBEDDING_DIMENSIONS = 1536
    
    def __init__(self):
        self._client: Optional[chromadb.Client] = None
        self._collection = None
        self._openai_client = None
        self._initialize()
    
    def _initialize(self):
        """Initialize ChromaDB and OpenAI clients."""
        if not CHROMA_AVAILABLE:
            logger.warning("ChromaDB not installed. Vector search disabled.")
            return
        
        try:
            # Initialize ChromaDB with persistent storage
            self._client = chromadb.Client(ChromaSettings(
                chroma_db_impl="duckdb+parquet",
                persist_directory="./chroma_data",
                anonymized_telemetry=False
            ))
            
            # Get or create collection
            self._collection = self._client.get_or_create_collection(
                name=self.COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"}
            )
            
            # Initialize OpenAI for embeddings
            self._openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            logger.info(f"ChromaDB initialized with {self._collection.count()} documents")
            
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}")
            self._client = None
    
    def _generate_embedding(self, text: str) -> List[float]:
        """Generate embedding vector for text using OpenAI."""
        if not self._openai_client:
            raise RuntimeError("OpenAI client not initialized")
        
        response = self._openai_client.embeddings.create(
            model=self.EMBEDDING_MODEL,
            input=text,
        )
        return response.data[0].embedding
    
    async def add_journal_entry(
        self,
        journal_id: str,
        user_id: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Add a journal entry to the vector store.
        
        Args:
            journal_id: Unique identifier for the journal entry
            user_id: User who owns the entry
            content: Journal text content
            metadata: Additional metadata (sentiment, emotions, date, etc.)
            
        Returns:
            True if successfully added
        """
        if not self._collection:
            logger.warning("Vector store not available")
            return False
        
        try:
            embedding = self._generate_embedding(content)
            
            doc_metadata = {
                "user_id": user_id,
                "created_at": datetime.utcnow().isoformat(),
                **(metadata or {})
            }
            
            self._collection.add(
                ids=[journal_id],
                embeddings=[embedding],
                documents=[content],
                metadatas=[doc_metadata]
            )
            
            logger.info(f"Added journal {journal_id} to vector store")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add journal to vector store: {e}")
            return False
    
    async def search_similar(
        self,
        user_id: str,
        query: str,
        n_results: int = 5,
        date_range: Optional[tuple] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for journal entries similar to the query.
        
        Args:
            user_id: Filter results to this user only
            query: Natural language query
            n_results: Number of results to return
            date_range: Optional (start_date, end_date) tuple
            
        Returns:
            List of matching documents with scores
        """
        if not self._collection:
            return []
        
        try:
            query_embedding = self._generate_embedding(query)
            
            # Build where filter
            where_filter = {"user_id": user_id}
            
            results = self._collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where_filter,
                include=["documents", "metadatas", "distances"]
            )
            
            # Format results
            formatted = []
            if results["ids"] and results["ids"][0]:
                for i, doc_id in enumerate(results["ids"][0]):
                    formatted.append({
                        "id": doc_id,
                        "content": results["documents"][0][i] if results["documents"] else "",
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                        "similarity": 1 - results["distances"][0][i] if results["distances"] else 0,
                    })
            
            return formatted
            
        except Exception as e:
            logger.error(f"Vector search failed: {e}")
            return []
    
    async def ask_past_self(
        self,
        user_id: str,
        question: str,
        n_context: int = 5
    ) -> Dict[str, Any]:
        """
        RAG-powered query: Ask questions about your past journal entries.
        
        Example questions:
        - "What helped me the last time I felt anxious?"
        - "When did I feel most happy this year?"
        - "What patterns do I notice in my stress?"
        
        Args:
            user_id: User ID
            question: Natural language question
            n_context: Number of relevant entries to retrieve
            
        Returns:
            AI-generated answer with source citations
        """
        if not self._openai_client:
            return {"answer": "AI service not available", "sources": []}
        
        # Retrieve relevant context
        similar_entries = await self.search_similar(user_id, question, n_results=n_context)
        
        if not similar_entries:
            return {
                "answer": "I don't have enough journal history to answer that question. Keep writing!",
                "sources": []
            }
        
        # Build context for RAG
        context_parts = []
        for i, entry in enumerate(similar_entries):
            date = entry.get("metadata", {}).get("created_at", "Unknown date")
            context_parts.append(f"Entry {i+1} ({date[:10]}):\n{entry['content'][:500]}")
        
        context = "\n\n---\n\n".join(context_parts)
        
        # Generate answer using GPT
        response = self._openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """You are a compassionate AI assistant helping someone reflect on their personal journal entries.
                    Answer their question based ONLY on the provided journal context.
                    Be warm, supportive, and highlight patterns or insights.
                    If the context doesn't contain relevant information, say so gently."""
                },
                {
                    "role": "user",
                    "content": f"Based on these journal entries:\n\n{context}\n\nAnswer this question: {question}"
                }
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return {
            "answer": response.choices[0].message.content,
            "sources": [
                {
                    "id": e["id"],
                    "date": e.get("metadata", {}).get("created_at", "")[:10],
                    "preview": e["content"][:100] + "...",
                    "similarity": round(e["similarity"], 3)
                }
                for e in similar_entries
            ]
        }
    
    async def delete_user_entries(self, user_id: str) -> int:
        """
        Delete all vector entries for a user (for account deletion).
        
        Returns:
            Number of entries deleted
        """
        if not self._collection:
            return 0
        
        try:
            # Get all IDs for this user
            results = self._collection.get(
                where={"user_id": user_id},
                include=[]
            )
            
            if results["ids"]:
                self._collection.delete(ids=results["ids"])
                logger.info(f"Deleted {len(results['ids'])} vector entries for user {user_id}")
                return len(results["ids"])
            
            return 0
            
        except Exception as e:
            logger.error(f"Failed to delete user vectors: {e}")
            return 0


# Singleton instance
vector_service = VectorService()
