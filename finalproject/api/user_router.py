from fastapi import APIRouter, Response, Header
from pydantic import BaseModel
from dal.user_crud import get_all_users, get_user, add_user, update_user, delete_user
from dal.user import User
from service.user_service import create_token, check_permission, get_user_profile

userRouter = APIRouter(prefix='/users')


class LoginRequest(BaseModel):
    name: str
    password: str


class UserInput(BaseModel):
    name: str
    password: str
    phone: str
    email: str
    role: str = "employee"


@userRouter.post("/login")
def login(req: LoginRequest):
    users = get_all_users()
    for user in users:
        if user.name == req.name and user._password == req.password:
            token = create_token(user)
            return {"token": token}
    return Response(status_code=401)


@userRouter.get("/me")
def get_profile(authorization: str = Header(...)):
    result, err = get_user_profile(authorization)
    if err:
        return Response(status_code=err)
    return result


@userRouter.get("/")
def get_all(authorization: str = Header(...)):
    if not check_permission(authorization, "admin"):
        return Response(status_code=403)
    return get_all_users()


@userRouter.get("/{id}")
def get_by_id(id: int, authorization: str = Header(...)):
    if not check_permission(authorization, "admin"):
        return Response(status_code=403)
    user = get_user(id)
    if not user:
        return Response(status_code=404)
    return user


@userRouter.post("/")
def create_user(user_input: UserInput, authorization: str = Header(...)):
    if not check_permission(authorization, "admin"):
        return Response(status_code=403)
    user = User(None, user_input.name, user_input.password, user_input.phone, user_input.email, user_input.role)
    add_user(user)
    return Response(status_code=201)


@userRouter.put("/{id}")
def update_user_route(id: int, user_input: UserInput, authorization: str = Header(...)):
    if not check_permission(authorization, "admin"):
        return Response(status_code=403)
    user = User(id, user_input.name, user_input.password, user_input.phone, user_input.email, user_input.role)
    if not update_user(user):
        return Response(status_code=404)
    return user


@userRouter.delete("/{id}")
def delete_user_route(id: int, authorization: str = Header(...)):
    if not check_permission(authorization, "admin"):
        return Response(status_code=403)
    if not delete_user(id):
        return Response(status_code=404)
    return Response(status_code=204)
