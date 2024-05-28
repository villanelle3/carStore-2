import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

const Register = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Estado para o checkbox
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/register', { 
                username, 
                password, 
                is_admin: isAdmin
            });
            console.log(response);
            if (response.status === 201) {
                setRedirect(true);
            }
        } catch (error) {
            alert('Erro ao registrar usuário');
            console.error(error);
        }
    };

    return (
        <>
            <div className="d-flex flex-column align-items-center mt-5">
            {redirect && <Alert variant="success" onClose={() => setRedirect(false)} dismissible>Usuário registrado! <Link to="/login">Fazer Login</Link></Alert>}
                <Form style={{ maxWidth: '300px' }} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check 
                            type="checkbox" 
                            label="Registrar como admin" 
                            checked={isAdmin} 
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                    </Form.Group>
                    <Button type="submit">Register</Button>
                </Form>
            </div>
        </>
    );
};

export default Register;
