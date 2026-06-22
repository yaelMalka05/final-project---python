from fastapi import FastAPI
import uvicorn
from task_router import taskRouter
from user_router import userRouter
from project_router import projectRouter
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(taskRouter)
app.include_router(userRouter)
app.include_router(projectRouter)








if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000)
