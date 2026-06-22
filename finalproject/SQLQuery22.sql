



CREATE TABLE projects (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(100),
    description NVARCHAR(500)
);

CREATE TABLE project_tasks (
    project_id INT REFERENCES projects(id),
    task_code INT REFERENCES tasks(code)
);
