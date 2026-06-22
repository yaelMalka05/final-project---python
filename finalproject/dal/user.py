class User:

    def __init__(self, id, name, password, phone, email, role="employee"):
        self.id = id
        self._password = password
        self.name = name
        self.phone = phone
        self.email = email
        self.role = role  # "admin" or "employee"

    def print_details(self):
        print(f"id: {self.id}, name: {self.name}, phone: {self.phone}, email: {self.email}, role: {self.role}")

