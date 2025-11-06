from services.database.manager import DatabaseManager
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
db_manager = DatabaseManager()
CORS(app, origins = "*")

@app.route('/', methods=['GET'])
def home():
    return {"message": "API de Gerenciamento da Pizzaria"}

@app.route('/restaurante', methods=['get'])
def get_restaurante():
    id_restaurante = request.args.get('id_restaurante', type =int)
    if id_restaurante is None:
        result = db_manager.execute_select_all("SELECT * FROM restaurante;")
        return jsonify(result)
    result = db_manager.execute_select_one(f"SELECT * FROM restaurante WHERE id_restaurante = {id_restaurante};")
    if result is None:
        return jsonify({"error": "Restaurante não encontrado"}), 404
    return jsonify(result)


# Inserir novo pedido
@app.route('/pedido', methods=['POST'])
def create_pedido():
    data = request.get_json()

    if not data:
        return jsonify({"error": "JSON body is required"}), 400

    id_cliente = data.get("id_cliente")
    id_restaurante = data.get("id_restaurante")
    id_funcionario = data.get("id_funcionario")
    taxa_entrega = data.get("taxa_entrega", 0)
    tipo = data.get("tipo")
    status = data.get("status", "pendente")
    endereco_entrega = data.get("endereco_entrega")
    itens = data.get("itens", [])

    if not id_cliente or not id_restaurante or not tipo or not endereco_entrega:
        return jsonify({"error": "Campos obrigatórios ausentes"}), 400

    data_hora = datetime.now()
    valor_total = 0

    for item in itens:
        item_id = item.get("id_item")
        quantidade = item.get("quantidade", 1)
        preco = db_manager.execute_select_one(
            f"SELECT preco FROM item_cardapio WHERE id_item = {item_id}"
        )
        if preco:
            valor_total += preco["preco"] * quantidade

    insert_pedido = f"""
        INSERT INTO pedido (taxa_entrega, data_hora, tipo, valor_total, status,
                            endereco_entrega, id_funcionario, id_cliente, id_restaurante)
        VALUES ({taxa_entrega}, '{data_hora}', '{tipo}', {valor_total}, '{status}',
                '{endereco_entrega}', {id_funcionario or 'NULL'}, {id_cliente}, {id_restaurante})
        RETURNING id_pedido;
    """
    pedido = db_manager.execute_select_one(insert_pedido)
    id_pedido = pedido["id_pedido"]

    for item in itens:
        db_manager.execute_query(f"""
            INSERT INTO pedido_item (id_pedido, id_item, quantidade)
            VALUES ({id_pedido}, {item['id_item']}, {item.get('quantidade', 1)});
        """)

    return jsonify({
        "message": "Pedido criado com sucesso!",
        "pedido_id": id_pedido,
        "valor_total": valor_total
    }), 201
    
@app.route('/pedidos', methods=['GET'])
def get_pedidos_restaurante():
    id_restaurante = request.args.get('id_restaurante', type=int)
    if id_restaurante is None:
        return jsonify({"error": "id_restaurante é obrigatório"}), 400

    query = f"""
        SELECT p.*, c.nome AS nome_cliente
        FROM pedido p
        JOIN cliente c ON p.id_cliente = c.id_cliente
        WHERE p.id_restaurante = {id_restaurante};
    """
    pedidos = db_manager.execute_select_all(query)
    if pedidos is None:
        return jsonify({"error": "Nenhum pedido encontrado para este restaurante"}), 404
    return jsonify(pedidos)

# Rota para mudar o status de um pedido 