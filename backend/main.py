from flask import Flask, request, jsonify, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from config import app, db
from models import Item, User, UserPermissions
import os


app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limite de 16MB


# Função que verifica se o usuário é admin
def is_admin(user_id):
    user_permission = UserPermissions.query.filter_by(user_id=user_id).first()
    return user_permission.is_admin if user_permission else False


# Rotas de autenticação
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Dados ausentes"}), 400

    username = data.get('username')
    password = data.get('password')
    is_admin_flag = data.get('is_admin', False)

    if not username or not password:
        return jsonify({"message": "Username e senha são obrigatórios"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Este username já está em uso"}), 400
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    try:
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        user_permission = UserPermissions(user_id=new_user.id, is_admin=is_admin_flag)
        db.session.add(user_permission)
        db.session.commit()

        return jsonify({"message": "Usuário registrado com sucesso!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erro ao registrar usuário: {str(e)}"}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username e senha são obrigatórios"}), 400

    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Credenciais inválidas!"}), 401

    user_permissions = UserPermissions.query.filter_by(user_id=user.id).first()
    is_admin = user_permissions.is_admin if user_permissions else False
    print(f"é adm? {is_admin}")
    access_token = create_access_token(identity={'username': user.username, 'is_admin': is_admin})
    return jsonify(access_token=access_token), 200


# Rota protegida
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
