from flask import Flask, request, jsonify, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from config import app, db
from models import Item
import os

# Configurações para upload de arquivos
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limite de 16MB para upload de arquivos permitidos

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
    data = request.form
    required_fields = ["nome", "marca", "modelo", "preco"]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"message": f"O campo {field} é obrigatório."}), 400

    if 'foto' not in request.files:
        return jsonify({"message": "O campo foto é obrigatório."}), 400

    photo = request.files['foto']
    if photo.filename == '':
        return jsonify({"message": "Nenhuma foto selecionada."}), 400

    filename = secure_filename(photo.filename)
    photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    photo_url = url_for('get_file', filename=filename, _external=True)

    try:
        novo_carro = Item(
            nome=data['nome'],
            marca=data['marca'],
            modelo=data['modelo'],
            preco=float(data['preco']),
            foto=photo_url
        )
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

    data = request.form

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

    if 'foto' in request.files:
        photo = request.files['foto']
        if photo.filename != '':
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            carro.foto = url_for('get_file', filename=filename, _external=True)

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


@app.route('/uploads/<filename>')
def get_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == "__main__":
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    with app.app_context():
        db.create_all()

    app.run(debug=True)
