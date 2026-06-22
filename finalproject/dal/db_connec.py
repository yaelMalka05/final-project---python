import pyodbc

connection = None

def get_connection():
    global connection
    if not connection:
        connection = pyodbc.connect(
            "DRIVER={SQL Server};"
            "SERVER=ayeletserver\\sql2022;"
            "DATABASE=tasks_project;"
            "Trusted_Connection=yes;"
        )
    return connection
