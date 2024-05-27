// useToken.jsx
import { useState } from 'react';

function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return tokenString ? JSON.parse(tokenString) : null;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken) => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    };

    const removeToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return {
        setToken: saveToken,
        token,
        removeToken
    };
}

export default useToken;
