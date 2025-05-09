import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const userService = {
    getMyPosts: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/posts/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    getMyComments: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/posts/0/comments/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    getLikedPosts: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/posts/liked`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    getBookmarkedPosts: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/posts/bookmarked`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
}; 