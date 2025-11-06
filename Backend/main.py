from services.database.manager import DatabaseManager
db = DatabaseManager()

def teste1():
    query = "SELECT * FROM cliente;"
    resultado = db.execute_select_all(query)
    print(resultado)
    
if __name__ == "__main__":
    teste1()