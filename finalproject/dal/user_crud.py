from __future__ import annotations
from dal.db_connec import get_connection
from dal.user import User


def _row_to_user(row) -> User:
    return User(row[0], row[1], row[2], row[3], row[4], row[5])


def get_all_users() -> list[User]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, password, phone, email, role FROM users")
    return [_row_to_user(row) for row in cursor.fetchall()]


def get_user(id: int) -> User | None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, password, phone, email, role FROM users WHERE id = ?", id)
    row = cursor.fetchone()
    return _row_to_user(row) if row else None


def add_user(user: User) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (name, password, phone, email, role) VALUES (?, ?, ?, ?, ?)",
        user.name, user._password, user.phone, user.email, user.role
    )
    conn.commit()
    return cursor.rowcount > 0


def update_user(user: User) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET name=?, password=?, phone=?, email=?, role=? WHERE id=?",
        user.name, user._password, user.phone, user.email, user.role, user.id
    )
    conn.commit()
    return cursor.rowcount > 0


def delete_user(id: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", id)
    conn.commit()
    return cursor.rowcount > 0
