from services.database.manager import DatabaseManager
db = DatabaseManager()


def teste1():
    query = "SELECT * FROM cliente;"
    resultado = db.execute_select_all(query)
    print(resultado)

def startAPI():
    from services.routes.dbroutes import app
    app.run(host='0.0.0.0', port=8000, debug=False)
    
if __name__ == "__main__":
    startAPI()