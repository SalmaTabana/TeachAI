import hashlib
import hmac
import secrets
from fastapi import Header, HTTPException
from .database import SessionLocal, Teacher, AuthSession

def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120_000)
    return f"{salt.hex()}:{digest.hex()}"

def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, digest_hex = stored.split(":", 1)
        digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), 120_000)
        return hmac.compare_digest(digest.hex(), digest_hex)
    except (ValueError, TypeError):
        return False

def create_session(teacher_id: int) -> str:
    token = secrets.token_urlsafe(48)
    with SessionLocal() as db:
        db.add(AuthSession(token=token, teacher_id=teacher_id))
        db.commit()
    return token

def get_current_teacher(authorization: str | None = Header(default=None)) -> Teacher:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Please log in first.")
    token = authorization[7:].strip()
    with SessionLocal() as db:
        session = db.get(AuthSession, token)
        if not session:
            raise HTTPException(status_code=401, detail="Your session has expired. Please log in again.")
        teacher = db.get(Teacher, session.teacher_id)
        if not teacher:
            raise HTTPException(status_code=401, detail="Teacher account not found.")
        return teacher
