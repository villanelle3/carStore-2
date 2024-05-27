import { useEffect, useState } from 'react';
import axios from 'axios';
import useToken from './useToken';

const ProtectedComponent = () => {
    const { token } = useToken();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/protected', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage(response.data.logged_in_as.username);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [token]);

    return <div>{message ? `Logado como ${message}` : 'Carregando...'}</div>;
};

export default ProtectedComponent;
