from config import db

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), unique=False, nullable=False)
    marca = db.Column(db.String(80), unique=False, nullable=False)
    modelo = db.Column(db.String(80), unique=False, nullable=False)
    preco = db.Column(db.Float, nullable=False)
    foto = db.Column(db.String(255), default="placeholder.png", nullable=False)

    def serialize(self):
        """
        Serialize o objeto em um dicionario.
        """
        return {
            "id": self.id,
            "nome": self.nome,
            "marca": self.marca,
            "modelo": self.modelo,
            "preco": self.preco,
            "foto": self.foto,
        }

    def validate(self):
        """
        Validar dados antes de salvar.
        """
        if self.preco <= 0:
            raise ValueError("O preço deve ser um valor válido.")
