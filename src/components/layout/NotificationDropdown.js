import React, { useEffect, useState, useRef } from 'react';
import { notificationService } from '../../services/notificationService';
import { FaBell } from 'react-icons/fa';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        // 클릭 외부 감지로 드롭다운 닫기
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        const data = await notificationService.getNotifications();
        setNotifications(data);
    };
    const fetchUnreadCount = async () => {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
    };
    const handleOpen = () => {
        setOpen((prev) => !prev);
        if (!open) fetchNotifications();
    };
    const handleMarkAsRead = async (id) => {
        await notificationService.markAsRead(id);
        fetchNotifications();
        fetchUnreadCount();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={handleOpen} className="relative p-2">
                <FaBell className="text-2xl text-black" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {unreadCount}
                    </span>
                )}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b font-bold text-black">알림</div>
                    <ul className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <li className="p-4 text-gray-400 text-center">알림이 없습니다.</li>
                        ) : (
                            notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className={`px-4 py-3 border-b last:border-b-0 cursor-pointer ${n.isRead ? 'bg-white' : 'bg-blue-50'}`}
                                    onClick={() => handleMarkAsRead(n.id)}
                                >
                                    <div className="text-black text-sm">{n.message}</div>
                                    <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown; 