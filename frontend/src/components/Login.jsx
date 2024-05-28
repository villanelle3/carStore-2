import axios from 'axios';
import useToken from './useToken';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';


const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState(false);
    const { setToken } = useToken();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', { username, password });
            setToken(response.data.access_token);
            onLogin();
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error('Erro no login:', error);
            setErro(true)
        }
    };

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            {erro && <Alert variant="danger" dismissible>Credenciais inválidas</Alert>}
            <Form style={{ maxWidth: '300px' }} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Button type="submit">Login</Button>
            </Form>
            <div className="mt-3">
                Não tem cadastro? <Link to="/register">Registre-se já</Link>
            </div>
        </div>
    );
};

export default Login;
