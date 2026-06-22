import pyodbc

def get_connection():
    return pyodbc.connect(
        "DRIVER={SQL Server};"
        "SERVER=ayeletserver\\sql2022;"
        "DATABASE=tasks_project;"
        "Trusted_Connection=yes;"
    )
