-- תיקון טבלת projects
ALTER TABLE projects ADD description NVARCHAR(500);
GO

-- נתוני דוגמה
INSERT INTO tasks (description, status, level, time, skill)
VALUES 
    ('בניית API', 'open', 'high', '3 days', 'Python'),
    ('עיצוב UI', 'open', 'medium', '2 days', 'CSS');
GO

INSERT INTO projects (name, description)
VALUES ('פרויקט ראשון', 'תיאור הפרויקט');
GO

INSERT INTO project_tasks (project_id, task_code)
VALUES (1, 1), (1, 2);
GO
