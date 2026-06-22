from fastapi import APIRouter, Response, Header
from pydantic import BaseModel
from service.project_service import get_all_projects_service, get_project_service, add_project_service, update_project_service, delete_project_service
from service.user_service import check_permission
from dal.project import Project
from dal.task_crud import get_task


class ProjectInput(BaseModel):
    name: str
    description: str
    task_codes: list[int] = []


projectRouter = APIRouter(prefix='/projects')


@projectRouter.get("/")
def get_all_projects(authorization: str = Header(...)):
    result, err = get_all_projects_service(authorization)
    if err:
        return Response(status_code=err)
    return [p.to_dict() for p in result]


@projectRouter.get("/{id}")
def get_project(id: int, authorization: str = Header(...)):
    result, err = get_project_service(id, authorization)
    if err:
        return Response(status_code=err)
    return result.to_dict()


@projectRouter.post("/")
def add_project(project_input: ProjectInput, authorization: str = Header(...)):
    tasks = [get_task(code) for code in project_input.task_codes]
    tasks = [t for t in tasks if t]
    project = Project(None, project_input.name, project_input.description, tasks)
    result, err = add_project_service(project, authorization)
    if err:
        return Response(status_code=err)
    return Response(status_code=201)


@projectRouter.put("/{id}")
def update_project(id: int, project_input: ProjectInput, authorization: str = Header(...)):
    tasks = [get_task(code) for code in project_input.task_codes]
    tasks = [t for t in tasks if t]
    project = Project(id, project_input.name, project_input.description, tasks)
    result, err = update_project_service(project, authorization)
    if err:
        return Response(status_code=err)
    return result.to_dict()


@projectRouter.post("/{id}/tasks/{task_code}")
def add_task_to_project(id: int, task_code: int, authorization: str = Header(...)):
    from dal.project_crud import get_project
    from dal.db_connec import get_connection
    if not check_permission(authorization, "admin"):
        return Response(status_code=403)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO project_tasks (project_id, task_code) VALUES (?, ?)", id, task_code)
    conn.commit()
    return get_project(id).to_dict()


@projectRouter.delete("/{id}/tasks/{task_code}")
def remove_task_from_project(id: int, task_code: int, authorization: str = Header(...)):
    from dal.project_crud import get_project
    from dal.db_connec import get_connection
    if not check_permission(authorization, "admin"):
        return Response(status_code=403)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM project_tasks WHERE project_id = ? AND task_code = ?", id, task_code)
    conn.commit()
    return get_project(id).to_dict()


@projectRouter.delete("/{id}")
def delete_project(id: int, authorization: str = Header(...)):
    result, err = delete_project_service(id, authorization)
    if err:
        return Response(status_code=err)
    return Response(status_code=204)
