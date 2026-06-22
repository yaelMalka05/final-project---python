from dal.project_crud import get_all_projects, get_project, add_project, update_project, delete_project
from dal.project import Project
from service.user_service import check_permission


def get_all_projects_service(token: str):
    if not check_permission(token, "employee"):
        return None, 403
    return get_all_projects(), None


def get_project_service(id: int, token: str):
    if not check_permission(token, "employee"):
        return None, 403
    project = get_project(id)
    if not project:
        return None, 404
    return project, None


def add_project_service(project: Project, token: str):
    if not check_permission(token, "admin"):
        return None, 403
    add_project(project)
    return project, None


def update_project_service(project: Project, token: str):
    if not check_permission(token, "admin"):
        return None, 403
    if not update_project(project):
        return None, 404
    return project, None


def delete_project_service(id: int, token: str):
    if not check_permission(token, "admin"):
        return None, 403
    if not delete_project(id):
        return None, 404
    return True, None
