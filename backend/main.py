from flask import request, jsonify
from config import app, db
from models import Item


@app.route("/carros", methods=["GET"])
def get_carros():
    """
    Retorna a lista de todos os carros na base de dados.
    """
    carros = Item.query.all()
    # json_carros = list(map(lambda x: x.serialize(), carros))
    json_carros = [carro.serialize() for carro in carros]
    return jsonify({"carros": json_carros})


@app.route("/create_car", methods=["POST"])
def create_car():
    """
    Cria um novo carro com os dados fornecidos.
    """
    data = request.json
    required_fields = ["nome", "marca", "modelo", "preco"]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"message": f"O campo {field} é obrigatório."}), 400

    try:
        novo_carro = Item(**data)
        novo_carro.validate()
        db.session.add(novo_carro)
        db.session.commit()
        return jsonify({"message": "Novo carro adicionado!"}), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


@app.route("/update_info/<int:carro_id>", methods=["PATCH"])
def update_info(carro_id):
    """
    Atualiza as informações de um carro existente.
    """
    carro = Item.query.get(carro_id)

    if not carro:
        return jsonify({"message": "Carro não encontrado."}), 404

    data = request.json

    try:
        if "preco" in data:
            preco = float(data["preco"])
            if preco <= 0:
                return jsonify({"message": "O preço deve ser maior que zero."}), 400
            carro.preco = preco
    except ValueError:
        return jsonify({"message": "O preço deve ser um número."}), 400

    carro.nome = data.get("nome", carro.nome)
    carro.marca = data.get("marca", carro.marca)
    carro.modelo = data.get("modelo", carro.modelo)
    carro.foto = data.get("foto", carro.foto)

    try:
        db.session.commit()
        return jsonify({"message": "Informações do carro atualizadas."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


@app.route("/delete_carro/<int:carro_id>", methods=["DELETE"])
def delete_carro(carro_id):
    """
    Deleta um carro existente.
    """
    carro = Item.query.get(carro_id)

    if not carro:
        return jsonify({"message": "Carro não encontrado."}), 404

    db.session.delete(carro)
    db.session.commit()

    return jsonify({"message": "Carro deletado!"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
