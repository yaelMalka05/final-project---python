# final-project---python
# Project & Task Management System 🚀

A full-stack web application for managing projects, tasks, and employees. The system features a robust Role-Based Access Control (RBAC) mechanism, separating capabilities between Administrators and regular Employees.

## 🌟 Key Features

* **Authentication & Security:** Secure login using JWT (JSON Web Tokens).
* **Role-Based Access Control (RBAC):**
    * **Admin:** Full access to manage users, create projects, add tasks, and assign employees to specific tasks.
    * **Employee:** View assigned tasks, update task status (e.g., mark as "completed"), and view related projects.
* **Admin-Approved Registration:** New Admin accounts can only be created with the approval (credentials) of an existing Admin.
* **Task Management:** Create, read, update, complete, and delete tasks. Support for skill requirements, time estimates, and difficulty levels.
* **Project Management:** Group tasks under specific projects and manage project scopes.
* **Database Management:** Fully normalized relational database using MS SQL Server, handling many-to-many relationships (e.g., `task_people`, `project_tasks`).

## 🛠️ Tech Stack

**Frontend:**
* React.js
* HTML5 / CSS3 (Responsive Design)
* Fetch API for backend communication

**Backend:**
* Python 3
* FastAPI (RESTful API framework)
* Uvicorn (ASGI server)
* PyJWT (Token generation and verification)

**Database:**
* Microsoft SQL Server
* `pyodbc` (Python DB driver)

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
* Node.js & npm installed
* Python 3.x installed
* Microsoft SQL Server & SSMS installed

### 1. Database Setup
1. Open SSMS (SQL Server Management Studio).
2. Execute the `SQL2.sql` script to create the `tasks_project` database and all required tables.
3. Execute the `SQLQuery2.sql` script to insert the default Administrator account.
   * *Default Admin Credentials:* Username: `ayelet`, Password: `1234`
4. Update the DB connection string in `db_connec.py` (specifically the `SERVER` parameter) to match your local MS SQL Server instance name.

### 2. Backend Setup
Navigate to the backend directory and install the required Python packages:

```bash
pip install fastapi uvicorn pyodbc pyjwt pydantic

```

Run the FastAPI server:

```bash
uvicorn app:app --reload

```

*The backend will run on `http://127.0.0.1:8000*`

### 3. Frontend Setup

Navigate to the frontend directory and install the dependencies:

```bash
npm install

```

Start the React development server:

```bash
npm start

```

*The frontend will run on `http://localhost:3000*`

## 🏛️ Architecture Overview

The backend follows a clean, layered architecture:

* **Routers (`*_router.py`):** Handles HTTP requests, responses, and routing.
* **Services (`*_service.py`):** Contains the business logic and authorization checks.
* **DAL (Data Access Layer - `*_crud.py`):** Manages direct database interactions and CRUD operations using raw SQL queries.
* **Models (`*.py`):** Python class representations of database entities (`User`, `Task`, `Project`).

