export const API_URL = 'http://localhost:8080/api';

export const getAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
}); 