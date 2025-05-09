import axios from 'axios';
import { userApi } from '../api/userApi';

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
    getMe: async () => {
        const token = localStorage.getItem('token');
        const res = await userApi.getMe(token);
        return res.data;
    },
    updateMe: async (data) => {
        const token = localStorage.getItem('token');
        const res = await userApi.updateMe(data, token);
        return res.data;
    },
    changePassword: async (data) => {
        const token = localStorage.getItem('token');
        await userApi.changePassword(data, token);
    },
    getUserProfile: async (username) => {
        const token = localStorage.getItem('token');
        const res = await userApi.getUserProfile(username, token);
        return res.data;
    },
    follow: async (username) => {
        const token = localStorage.getItem('token');
        await userApi.follow(username, token);
    },
    unfollow: async (username) => {
        const token = localStorage.getItem('token');
        await userApi.unfollow(username, token);
    },
    getFollowing: async (username) => {
        const token = localStorage.getItem('token');
        const res = await userApi.getFollowing(username, token);
        return res.data;
    },
    getFollowers: async (username) => {
        const token = localStorage.getItem('token');
        const res = await userApi.getFollowers(username, token);
        return res.data;
    },
    getFollowStatus: async (username) => {
        const token = localStorage.getItem('token');
        const res = await userApi.getFollowStatus(username, token);
        return res.data;
    },
}; 