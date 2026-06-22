CREATE DATABASE tasks_project;
GO

USE tasks_project;
GO

CREATE TABLE users (
    id       INT IDENTITY(1,1) PRIMARY KEY,
    name     NVARCHAR(100) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    phone    NVARCHAR(20),
    email    NVARCHAR(100),
    role     NVARCHAR(20) DEFAULT 'employee'
);
GO

CREATE TABLE tasks (
    code        INT IDENTITY(1,1) PRIMARY KEY,
    description NVARCHAR(500),
    status      NVARCHAR(50),
    level       NVARCHAR(50),
    time        NVARCHAR(50),
    skill       NVARCHAR(100)
);
GO

CREATE TABLE task_people (
    task_code INT NOT NULL,
    user_id   INT NOT NULL,
    PRIMARY KEY (task_code, user_id),
    FOREIGN KEY (task_code) REFERENCES tasks(code) ON DELETE CASCADE,
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE
);
GO

CREATE TABLE projects (
    id   INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100)
);
GO

CREATE TABLE project_tasks (
    project_id INT NOT NULL,
    task_code  INT NOT NULL,
    PRIMARY KEY (project_id, task_code),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (task_code)  REFERENCES tasks(code)  ON DELETE CASCADE
);
GO
