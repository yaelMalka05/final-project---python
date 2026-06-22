from fastapi import APIRouter, Response, Header
from pydantic import BaseModel
from service.task_service import get_all_tasks_service, get_task_service, add_task_service, complete_task_service, delete_task_service
from dal.task import Task


class TaskInput(BaseModel):
    description: str
    status: str
    level: str
    time: str
    skill: str
    people_ids: list[int] = []

taskRouter = APIRouter(prefix='/tasks')


@taskRouter.get("/")
def get_all_tasks(authorization: str = Header(...)):
    result, err = get_all_tasks_service(authorization)
    if err:
        return Response(status_code=err)
    return result


@taskRouter.get("/{code}")
def get_task_by_code(code: int, authorization: str = Header(...)):
    result, err = get_task_service(code, authorization)
    if err:
        return Response(status_code=err)
    return result


@taskRouter.post("/")
def add_task(task_input: TaskInput, authorization: str = Header(...)):
    from dal.user_crud import get_user
    people = [get_user(uid) for uid in task_input.people_ids]
    people = [p for p in people if p]
    task = Task(None, task_input.description, task_input.status, task_input.level, task_input.time, task_input.skill, people)
    result, err = add_task_service(task, authorization)
    if err:
        return Response(status_code=err)
    return Response(status_code=201)


@taskRouter.put("/{code}")
def complete_task(code: int, authorization: str = Header(...)):
    result, err = complete_task_service(code, authorization)
    if err:
        return Response(status_code=err)
    return result


@taskRouter.delete("/{code}")
def delete_task(code: int, authorization: str = Header(...)):
    result, err = delete_task_service(code, authorization)
    if err:
        return Response(status_code=err)
    return Response(status_code=204)
