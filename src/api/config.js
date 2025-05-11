export const API_URL = 'http://localhost:8080/api';

export const getAuthHeader = (token) => {
    if (!token) {
        throw new Error('No token provided');
    }
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
}; 