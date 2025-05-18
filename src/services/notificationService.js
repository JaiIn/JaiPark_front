import { notificationApi } from '../api/notificationApi';

export const notificationService = {
    getNotifications: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const res = await notificationApi.getNotifications(token);
            return res.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },
    
    markAsRead: async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            await notificationApi.markAsRead(id, token);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },
    
    markAllAsRead: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            await notificationApi.markAllAsRead(token);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },
    
    getUnreadCount: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const res = await notificationApi.getUnreadCount(token);
            return res.data;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    },
};