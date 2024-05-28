import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

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

    const isAdmin = () => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.sub.is_admin || false;
            } catch (e) {
                console.error("Error decoding token:", e);
                return false;
            }
        }
        return false;
    };

    const getUsername = () => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.sub.username || '';
            } catch (e) {
                console.error("Error decoding token:", e);
                return '';
            }
        }
        return '';
    };

    useEffect(() => {
        setToken(getToken());
    }, []);

    return {
        setToken: saveToken,
        token,
        removeToken,
        isAdmin,
        getUsername
    };
}

export default useToken;