# Task Management System (Python / FastAPI + React)

A full-stack task and project management system for a team. Admins manage users, tasks and projects; employees see only the tasks and projects they are assigned to.

Second-year course project.

## Features

- **Authentication** – login and registration with JWT tokens (valid for 2 hours).
- **Roles** – `admin` and `employee`. Creating a new admin requires the credentials of an existing admin.
- **Users** (admin) – list, add and delete employees.
- **Tasks** – description, status, level, estimated time and required skill.
  - Admin: create, delete, assign employees.
  - Employee: view own tasks and mark them as completed.
- **Projects** – a project groups several tasks.
  - Admin: create, delete, add/remove tasks, assign employees.
  - Employee: view projects that contain tasks assigned to them.

## Tech Stack

- **Server:** Python, FastAPI, Uvicorn, PyJWT, pyodbc
- **Database:** Microsoft SQL Server
- **Client:** React (JavaScript)

## Architecture

The server is split into three layers:

- `api/` – FastAPI routers (HTTP endpoints)
- `service/` – business logic and permission checks
- `dal/` – data access: model classes and SQL queries

```
final-project---python/
├── finalproject/      # server
│   ├── api/
│   ├── service/
│   ├── dal/
│   └── SQL2.sql       # database creation script
└── cliant/src/        # React client
```

## Database

Tables: `users`, `tasks`, `projects`, plus the linking tables `task_people` (task ↔ user) and `project_tasks` (project ↔ task).

## API Overview

| Resource | Endpoints |
|----------|-----------|
| Users    | `POST /users/register`, `POST /users/login`, `GET /users/me`, `GET/POST/PUT/DELETE /users` (admin) |
| Tasks    | `GET/POST /tasks`, `GET /tasks/{code}`, `PUT /tasks/{code}` (complete), `PUT /tasks/{code}/assign`, `DELETE /tasks/{code}` |
| Projects | `GET/POST /projects`, `GET/PUT/DELETE /projects/{id}`, `POST/DELETE /projects/{id}/tasks/{task_code}` |

Every request except login and register needs the JWT token in the `Authorization` header.
Interactive documentation is available at `http://127.0.0.1:8000/docs`.

## Getting Started

1. Create the database by running `finalproject/SQL2.sql` in SQL Server, then update the connection string in `finalproject/dal/db_connec.py`.
2. Install the server dependencies:
   ```
   pip install fastapi uvicorn pyodbc pyjwt
   ```
3. (Optional) set a JWT secret: `JWT_SECRET=<your secret>`
4. Run the server from the `finalproject/api` folder (the server listens on port 8000).
5. Run the client from the `cliant` folder with `npm start` (opens on port 3000).

## Known Issues

(
- Passwords are stored and compared as plain text, with no hashing.
- If the `JWT_SECRET` environment variable is not set, the server uses a hard-coded fallback secret.
- The database connection string is hard-coded to a local server, and a new connection is opened for every query and never closed.
- There is no `requirements.txt`, and the client has no `package.json`, so dependencies must be installed manually.
- The database scripts are scattered across many `SQLQuery*.sql` files. `SQL2.sql` is outdated: it creates `projects` without the `description` column that the code uses.
- New IDs are fetched with `SELECT MAX(...)`, which is unsafe when several requests run at the same time (`SCOPE_IDENTITY()` would be better).
- Any employee can mark any task as completed, not only tasks assigned to them.
- Usernames are not unique, and the update-user endpoint returns the whole user object, which may expose the password field.
- Adding or removing a task in a project is written directly in the router instead of the service layer, and a duplicate add is not handled.
- The Postman collections are empty, there are no tests, and IDE/cache folders (`.idea`, `.vs`, `__pycache__`) are included in the repository.
)
