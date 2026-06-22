from dal.task import Task

class Project:
    def __init__(self, id, name, description, taskArr: list[Task] = None):
        self.id = id
        self.name = name
        self.description = description
        self.tasks = taskArr or []

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "tasks": [t.to_dict() for t in self.tasks]
        }
