from fastapi import FastAPI
import uvicorn
from task_router import taskRouter
from user_router import userRouter
from project_router import projectRouter


app = FastAPI()
app.include_router(taskRouter)
app.include_router(userRouter)
app.include_router(projectRouter)








if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000)
