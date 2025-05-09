import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    signup: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, userData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Invalid input data');
            } else if (error.response?.status === 409) {
                throw new Error('Username or email already exists');
            } else {
                throw new Error('Signup failed. Please try again later.');
            }
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    }
}; 