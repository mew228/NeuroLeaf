"""
AES-256 Encryption Service for NeuroLeaf
Provides end-to-end encryption for sensitive journal content.
"""

import os
import base64
import logging
from typing import Optional, Tuple
import hashlib

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend

logger = logging.getLogger(__name__)


class EncryptionService:
    """
    AES-256-CBC encryption for journal content.
    
    Security Model:
    - Each user has a unique encryption key derived from their password
    - Server never stores plaintext passwords or raw encryption keys
    - Journal content is encrypted before database storage
    - Decryption requires user authentication
    """
    
    ALGORITHM = algorithms.AES
    BLOCK_SIZE = 128  # bits
    KEY_SIZE = 256    # bits (32 bytes)
    
    def __init__(self):
        self._backend = default_backend()
    
    def derive_key(self, password: str, salt: bytes) -> bytes:
        """
        Derive a 256-bit encryption key from user password.
        Uses PBKDF2 with SHA-256.
        
        Args:
            password: User's plaintext password
            salt: Unique salt for this user (stored in DB)
            
        Returns:
            32-byte encryption key
        """
        from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
        from cryptography.hazmat.primitives import hashes
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=self._backend
        )
        return kdf.derive(password.encode('utf-8'))
    
    def generate_salt(self) -> bytes:
        """Generate a cryptographically secure random salt."""
        return os.urandom(16)
    
    def encrypt(self, plaintext: str, key: bytes) -> Tuple[bytes, bytes]:
        """
        Encrypt plaintext using AES-256-CBC.
        
        Args:
            plaintext: Text to encrypt
            key: 32-byte encryption key
            
        Returns:
            Tuple of (ciphertext, iv)
        """
        # Generate random IV
        iv = os.urandom(16)
        
        # Pad plaintext to block size
        padder = padding.PKCS7(self.BLOCK_SIZE).padder()
        padded_data = padder.update(plaintext.encode('utf-8')) + padder.finalize()
        
        # Encrypt
        cipher = Cipher(
            algorithms.AES(key),
            modes.CBC(iv),
            backend=self._backend
        )
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(padded_data) + encryptor.finalize()
        
        return ciphertext, iv
    
    def decrypt(self, ciphertext: bytes, key: bytes, iv: bytes) -> str:
        """
        Decrypt ciphertext using AES-256-CBC.
        
        Args:
            ciphertext: Encrypted data
            key: 32-byte encryption key
            iv: Initialization vector used during encryption
            
        Returns:
            Decrypted plaintext
        """
        # Decrypt
        cipher = Cipher(
            algorithms.AES(key),
            modes.CBC(iv),
            backend=self._backend
        )
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(ciphertext) + decryptor.finalize()
        
        # Unpad
        unpadder = padding.PKCS7(self.BLOCK_SIZE).unpadder()
        plaintext = unpadder.update(padded_data) + unpadder.finalize()
        
        return plaintext.decode('utf-8')
    
    def encrypt_for_storage(self, plaintext: str, key: bytes) -> str:
        """
        Encrypt and encode for database storage.
        Combines IV and ciphertext into a single base64 string.
        
        Args:
            plaintext: Text to encrypt
            key: 32-byte encryption key
            
        Returns:
            Base64-encoded string (IV + ciphertext)
        """
        ciphertext, iv = self.encrypt(plaintext, key)
        # Prepend IV to ciphertext
        combined = iv + ciphertext
        return base64.b64encode(combined).decode('utf-8')
    
    def decrypt_from_storage(self, encrypted_data: str, key: bytes) -> str:
        """
        Decrypt data retrieved from database storage.
        
        Args:
            encrypted_data: Base64-encoded string from database
            key: 32-byte encryption key
            
        Returns:
            Decrypted plaintext
        """
        combined = base64.b64decode(encrypted_data)
        # Extract IV (first 16 bytes) and ciphertext
        iv = combined[:16]
        ciphertext = combined[16:]
        return self.decrypt(ciphertext, key, iv)


class ClientSideEncryption:
    """
    Utilities for client-side encryption.
    The actual encryption happens in the browser using Web Crypto API.
    This class provides helpers for the server to work with client-encrypted data.
    """
    
    @staticmethod
    def is_client_encrypted(data: str) -> bool:
        """
        Check if data appears to be client-side encrypted.
        Client-encrypted data has a specific prefix.
        """
        return data.startswith("NL_E2E:")
    
    @staticmethod
    def get_encrypted_payload(data: str) -> Optional[str]:
        """
        Extract the encrypted payload from client-encrypted data.
        """
        if ClientSideEncryption.is_client_encrypted(data):
            return data[7:]  # Remove "NL_E2E:" prefix
        return None
    
    @staticmethod
    def wrap_for_storage(encrypted_payload: str) -> str:
        """
        Wrap client-encrypted payload for storage.
        """
        return f"NL_E2E:{encrypted_payload}"


# Singleton instance
encryption_service = EncryptionService()


# Example usage and testing
if __name__ == "__main__":
    # Test encryption/decryption
    service = EncryptionService()
    
    # Generate user-specific salt (stored in DB)
    salt = service.generate_salt()
    
    # Derive key from password
    key = service.derive_key("user_password_123", salt)
    
    # Encrypt journal content
    original = "Today I felt really anxious about the meeting..."
    encrypted = service.encrypt_for_storage(original, key)
    
    print(f"Original: {original}")
    print(f"Encrypted: {encrypted[:50]}...")
    
    # Decrypt
    decrypted = service.decrypt_from_storage(encrypted, key)
    print(f"Decrypted: {decrypted}")
    
    assert original == decrypted, "Encryption/decryption failed!"
    print("✓ Encryption test passed!")
