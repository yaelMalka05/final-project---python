from fastapi import APIRouter, Response, Header
from pydantic import BaseModel
from service.task_service import get_all_tasks_service, get_task_service, add_task_service, complete_task_service, delete_task_service
from dal.task_crud import get_task, update_task
from dal.task import Task
from service.user_service import check_permission


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
    return [t.to_dict() for t in result]


@taskRouter.get("/{code}")
def get_task_by_code(code: int, authorization: str = Header(...)):
    result, err = get_task_service(code, authorization)
    if err:
        return Response(status_code=err)
    return result.to_dict()


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


@taskRouter.put("/{code}/assign")
def assign_people(code: int, body: dict, authorization: str = Header(...)):
    if not check_permission(authorization, "admin"):
        return Response(status_code=403)
    from dal.user_crud import get_user
    task = get_task(code)
    if not task:
        return Response(status_code=404)
    people = [get_user(uid) for uid in body.get("people_ids", [])]
    task.people = [p for p in people if p]
    update_task(task)
    return task.to_dict()


@taskRouter.put("/{code}")
def complete_task(code: int, authorization: str = Header(...)):
    result, err = complete_task_service(code, authorization)
    if err:
        return Response(status_code=err)
    return result.to_dict()


@taskRouter.delete("/{code}")
def delete_task(code: int, authorization: str = Header(...)):
    result, err = delete_task_service(code, authorization)
    if err:
        return Response(status_code=err)
    return Response(status_code=204)
