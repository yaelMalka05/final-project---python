from __future__ import annotations
from dal.db_connec import get_connection
from dal.project import Project
from dal.task_crud import get_task


def _build_project(row) -> Project:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT task_code FROM project_tasks WHERE project_id = ?", row[0])
    tasks = [get_task(r[0]) for r in cursor.fetchall()]
    tasks = [t for t in tasks if t]
    return Project(row[0], row[1], row[2], tasks)


def get_all_projects() -> list[Project]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description FROM projects")
    return [_build_project(row) for row in cursor.fetchall()]


def get_project(id: int) -> Project | None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description FROM projects WHERE id = ?", id)
    row = cursor.fetchone()
    return _build_project(row) if row else None


def add_project(project: Project) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO projects (name, description) VALUES (?, ?)", project.name, project.description)
    conn.commit()
    cursor.execute("SELECT MAX(id) FROM projects")
    new_id = cursor.fetchone()[0]
    for task in project.tasks:
        cursor.execute("INSERT INTO project_tasks (project_id, task_code) VALUES (?, ?)", new_id, task.code)
    conn.commit()
    return True


def update_project(project: Project) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE projects SET name=?, description=? WHERE id=?", project.name, project.description, project.id)
    conn.commit()
    if cursor.rowcount == 0:
        return False
    cursor.execute("DELETE FROM project_tasks WHERE project_id = ?", project.id)
    for task in project.tasks:
        cursor.execute("INSERT INTO project_tasks (project_id, task_code) VALUES (?, ?)", project.id, task.code)
    conn.commit()
    return True


def delete_project(id: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM project_tasks WHERE project_id = ?", id)
    cursor.execute("DELETE FROM projects WHERE id = ?", id)
    conn.commit()
    return cursor.rowcount > 0
