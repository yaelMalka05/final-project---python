from __future__ import annotations
from dal.db_connec import get_connection
from dal.task import Task
from dal.user_crud import get_user


def _build_task(row) -> Task:
    code, description, status, level, time, skill = row[0], row[1], row[2], row[3], row[4], row[5]
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM task_people WHERE task_code = ?", code)
    people = [get_user(r[0]) for r in cursor.fetchall()]
    people = [p for p in people if p]
    return Task(code, description, status, level, time, skill, people)


def get_all_tasks() -> list[Task]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT code, description, status, level, time, skill FROM tasks")
    return [_build_task(row) for row in cursor.fetchall()]


def get_task(code: int) -> Task | None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT code, description, status, level, time, skill FROM tasks WHERE code = ?", code)
    row = cursor.fetchone()
    return _build_task(row) if row else None


def add_task(task: Task) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tasks (description, status, level, time, skill) VALUES (?, ?, ?, ?, ?)",
        task.description, task.status, task.level, task.time, task.skill
    )
    conn.commit()
    cursor.execute("SELECT MAX(code) FROM tasks")
    new_code = cursor.fetchone()[0]
    for person in task.people:
        cursor.execute("INSERT INTO task_people (task_code, user_id) VALUES (?, ?)", new_code, person.id)
    conn.commit()
    return True


def update_task(task: Task) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE tasks SET description=?, status=?, level=?, time=?, skill=? WHERE code=?",
        task.description, task.status, task.level, task.time, task.skill, task.code
    )
    conn.commit()
    if cursor.rowcount == 0:
        return False
    cursor.execute("DELETE FROM task_people WHERE task_code = ?", task.code)
    for person in task.people:
        cursor.execute("INSERT INTO task_people (task_code, user_id) VALUES (?, ?)", task.code, person.id)
    conn.commit()
    return True


def delete_task(code: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM task_people WHERE task_code = ?", code)
    cursor.execute("DELETE FROM tasks WHERE code = ?", code)
    conn.commit()
    return cursor.rowcount > 0
