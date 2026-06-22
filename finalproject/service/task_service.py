from dal.task_crud import get_all_tasks, get_task, add_task, update_task, delete_task
from dal.task import Task
from service.user_service import check_permission


def get_all_tasks_service(token: str):
    if not check_permission(token, "employee"):
        return None, 403
    return get_all_tasks(), None


def get_task_service(code: int, token: str):
    if not check_permission(token, "employee"):
        return None, 403
    task = get_task(code)
    if not task:
        return None, 404
    return task, None


def add_task_service(task: Task, token: str):
    if not check_permission(token, "admin"):
        return None, 403
    add_task(task)
    return task, None


def complete_task_service(code: int, token: str):
    if not check_permission(token, "employee"):
        return None, 403
    task = get_task(code)
    if not task:
        return None, 404
    task.status = "completed"
    update_task(task)
    return task, None


def delete_task_service(code: int, token: str):
    if not check_permission(token, "admin"):
        return None, 403
    if not delete_task(code):
        return None, 404
    return True, None
