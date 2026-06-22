from dal.user import User


class Task:

    def __init__(self, code, description , status, level, time,skill , peopleArr:list[User]):
         self.code = code
         self.description = description
         self.status = status
         self.level = level
         self.time = time
         self.skill = skill
         self.people = peopleArr

    def print_details(self):
        print(f"code: {self.code}, description: {self.description}, status: {self.status}, level: {self.level}, time: {self.time}, skill: {self.skill}, people: {[p.name for p in self.people]}")


