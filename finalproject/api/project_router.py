from fastapi import APIRouter, Response, Header
from pydantic import BaseModel
from service.project_service import get_all_projects_service, get_project_service, add_project_service, update_project_service, delete_project_service
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
    return result


@projectRouter.get("/{id}")
def get_project(id: int, authorization: str = Header(...)):
    result, err = get_project_service(id, authorization)
    if err:
        return Response(status_code=err)
    return result


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
    return result


@projectRouter.delete("/{id}")
def delete_project(id: int, authorization: str = Header(...)):
    result, err = delete_project_service(id, authorization)
    if err:
        return Response(status_code=err)
    return Response(status_code=204)
