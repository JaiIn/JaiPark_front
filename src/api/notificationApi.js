import axios from 'axios';
import { API_URL, getAuthHeader } from './config';

export const notificationApi = {
    getNotifications: (token) => axios.get(`${API_URL}/notifications`, getAuthHeader(token)),
    markAsRead: (id, token) => axios.put(`${API_URL}/notifications/${id}/read`, {}, getAuthHeader(token)),
    markAllAsRead: (token) => axios.put(`${API_URL}/notifications/read-all`, {}, getAuthHeader(token)),
    getUnreadCount: (token) => axios.get(`${API_URL}/notifications/unread-count`, getAuthHeader(token)),
}; 