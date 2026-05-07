// src/components/layout/Layout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useState } from 'react';
import {
  LayoutDashboard, Users, Brain, Calendar, FileText,
  Activity, Atom, Bell, LogOut, ChevronRight, Menu, X, Wifi
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients',     icon: Users,           label: 'Patients' },
  { to: '/ai-predict',   icon: Brain,           label: 'AI Predict' },
  { to: '/quantum',      icon: Atom,            label: 'Quantum Engine' },
  { to: '/appointments', icon: Calendar,        label: 'Appointments' },
  { to: '/reports',      icon: FileText,        label: 'Reports' },
  { to: '/logs',         icon: Activity,        label: 'Activity Logs' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { unread, notifications, markRead } = useNotifications();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col flex-shrink-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
            <Brain size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-bold text-sm text-blue-600 tracking-wider">NeuroQ AI</div>
              <div className="text-xs text-slate-400">Neural Diagnostics</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border border-blue-300'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => <>
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
                {sidebarOpen && isActive && <ChevronRight size={14} className="ml-auto text-blue-600" />}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </>}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-slate-200">
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.full_name || user?.username}</div>
                <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
              </div>
            </div>
          )}
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={16} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400">
              {sidebarOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
            <div className="flex items-center gap-2">
              <Wifi size={12} className="text-green-400 animate-pulse" />
              <span className="text-xs text-green-400">MySQL Live</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700">
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white border border-slate-200 rounded-xl shadow-sm shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-sm font-semibold">Notifications</span>
                    <span className="text-xs text-blue-600 cursor-pointer" onClick={() => { /* markAllRead */ }}>Mark all read</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-cyan-900/10">
                    {notifications.length === 0 && (
                      <div className="py-6 text-center text-sm text-slate-400">No notifications</div>
                    )}
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => markRead(n.id)}
                        className={`px-4 py-3 cursor-pointer hover:bg-slate-50 ${!n.is_read ? 'bg-blue-50/50' : ''}`}>
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            n.type==='alert'?'bg-red-400':n.type==='success'?'bg-green-400':
                            n.type==='warning'?'bg-yellow-400':'bg-cyan-400'}`} />
                          <div>
                            <div className="text-xs font-medium">{n.title}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{n.message}</div>
                            <div className="text-xs text-slate-400 mt-1">{new Date(n.created_at).toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
