import jwt
import os
from datetime import datetime, timezone, timedelta
from dal.user_crud import get_user, get_user_by_name, add_user

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


def register_user(name: str, password: str, phone: str, email: str, role: str, approving_admin_name: str = None, approving_admin_password: str = None):
    """
    רישום משתמש חדש.
    אם role == 'admin' - חובה לספק שם וסיסמה של מנהל קיים לאישור.
    מחזיר (token, None) בהצלחה או (None, status_code) בשגיאה.
    """
    if role == "admin":
        if not approving_admin_name or not approving_admin_password:
            return None, 400  # חסרים פרטי מנהל מאשר
        approving_admin = get_user_by_name(approving_admin_name)
        if not approving_admin or approving_admin.role != "admin" or approving_admin._password != approving_admin_password:
            return None, 403  # מנהל מאשר לא נמצא או פרטים שגויים

    from dal.user import User
    new_user = User(None, name, password, phone, email, role)
    add_user(new_user)

    # שליפת המשתמש שנוצר כדי לקבל את ה-id
    created = get_user_by_name(name)
    token = create_token(created)
    return token, None


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
