import jwt
import os
from datetime import datetime, timezone, timedelta
from dal.user_crud import get_user

SECRET = os.environ.get("JWT_SECRET", "fallback_secret")
ALGORITHM = "HS256"


def create_token(user) -> str:
    payload = {
        "id": user.id,
        "name": user.name,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=2)
    }
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


def check_permission(token: str, required_role: str) -> bool:
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        role = payload.get("role")
        if required_role == "employee":
            return role in ("employee", "admin")
        if required_role == "admin":
            return role == "admin"
        return False
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False


def get_user_profile(token: str):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        user = get_user(payload.get("id"))
        if not user:
            return None, 404
        return {
            "id": user.id,
            "name": user.name,
            "phone": user.phone,
            "email": user.email,
            "role": user.role
        }, None
    except jwt.ExpiredSignatureError:
        return None, 401
    except jwt.InvalidTokenError:
        return None, 401
