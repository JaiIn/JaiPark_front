import { notificationApi } from '../api/notificationApi';

export const notificationService = {
    getNotifications: async () => {
        const token = localStorage.getItem('token');
        const res = await notificationApi.getNotifications(token);
        return res.data;
    },
    markAsRead: async (id) => {
        const token = localStorage.getItem('token');
        await notificationApi.markAsRead(id, token);
    },
    getUnreadCount: async () => {
        const token = localStorage.getItem('token');
        const res = await notificationApi.getUnreadCount(token);
        return res.data;
    },
}; 