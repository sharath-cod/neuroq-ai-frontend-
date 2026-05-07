// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const NotifContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnread(res.data.unread);
    } catch {}
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('nq_token');
    if (token) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchNotifs]);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    fetchNotifs();
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    fetchNotifs();
  };

  return (
    <NotifContext.Provider value={{ notifications, unread, markRead, markAllRead, fetchNotifs }}>
      {children}
    </NotifContext.Provider>
  );
}

export const useNotifications = () => useContext(NotifContext);
