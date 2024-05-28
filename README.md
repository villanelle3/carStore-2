# CarStore

Catálogo de veículos à venda, que utiliza uma API desenvolvida em Flask para o backend e um aplicativo React para o frontend.

## Estrutura do Projeto

- `backend/`: Contém o código do servidor Flask.
- `frontend/`: Contém o código do aplicativo React.

## Requisitos

- Python 3.6 ou superior
- Node.js 14 ou superior
- npm 6 ou superior

## Funcionalidades

- Catálogo de veículos à venda ordenados por valor.
- Login e registro de usuários.
- Login de administrador para cadastro, edição e deleção de veículos (Cadatre-se como administrador para testar)
- Token JWT
- Interface amigável para gerenciamento de veículos.

## Passos para Configurar e Executar o Projeto

### Configurando o Backend

1. Navegue até o diretório `backend`:

    ```sh
    cd backend
    ```

2. Instale as dependências:

    ```sh
    pip install -r requirements.txt
    ```

3. Execute o servidor Flask:

    ```sh
    python main.py
    ```

### Configurando o Frontend

1. Navegue até o diretório `frontend`:

    ```sh
    cd frontend
    ```

2. Instale as dependências:

    ```sh
    npm install
    ```

3. Execute o aplicativo React:

    ```sh
    npm run dev
    ```

## Detalhes Adicionais

### Backend

O backend é construído utilizando Flask e expõe uma API para gerenciar veículos. Verifique se servidor Flask está rodando antes de iniciar o frontend.

### .env

```env
FLASK_APP=main.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///site.db
