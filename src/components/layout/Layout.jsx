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
    <div className="flex h-screen overflow-hidden" style={{background:'linear-gradient(135deg,#f8faff 0%,#eef2ff 40%,#f0f7ff 70%,#f5f9ff 100%)'}}>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex flex-col flex-shrink-0 border-r`}
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 60%, #eef3ff 100%)',
          borderColor: 'rgba(196,213,240,0.7)',
          boxShadow: '2px 0 16px rgba(79,114,205,0.06)'
        }}>

        {/* Logo */}
        <div className="p-4 flex items-center gap-3" style={{borderBottom:'1px solid rgba(196,213,240,0.6)'}}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{background:'linear-gradient(135deg,#4f72cd,#0891b2)', boxShadow:'0 4px 12px rgba(79,114,205,0.3)'}}>
            <Brain size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-bold text-sm tracking-wide" style={{fontFamily:'Plus Jakarta Sans,sans-serif',background:'linear-gradient(135deg,#4f72cd,#0891b2)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                NeuroQ AI
              </div>
              <div className="text-xs text-slate-400" style={{fontFamily:'DM Sans,sans-serif'}}>Neural Diagnostics</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  isActive ? 'nav-active' : 'text-slate-500 hover:bg-slate-100/70 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => <>
                <Icon size={17} className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {sidebarOpen && (
                  <span className="text-sm font-medium" style={{fontFamily:'DM Sans,sans-serif', color: isActive ? '#4f72cd' : undefined}}>
                    {label}
                  </span>
                )}
                {sidebarOpen && isActive && <ChevronRight size={13} className="ml-auto text-blue-500" />}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50"
                    style={{background:'#1e293b', color:'#f8fafc', boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>
                    {label}
                  </div>
                )}
              </>}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3" style={{borderTop:'1px solid rgba(196,213,240,0.6)'}}>
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{background:'linear-gradient(135deg,#6366f1,#4f72cd)'}}>
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-700 truncate" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>
                  {user?.full_name || user?.username}
                </div>
                <div className="text-xs text-slate-400 capitalize" style={{fontFamily:'DM Sans,sans-serif'}}>{user?.role}</div>
              </div>
            </div>
          )}
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl transition-all text-slate-400 hover:text-red-500 hover:bg-red-50">
            <LogOut size={15} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm" style={{fontFamily:'DM Sans,sans-serif'}}>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-5 flex-shrink-0"
          style={{
            background:'linear-gradient(90deg,rgba(255,255,255,0.97) 0%,rgba(248,251,255,0.95) 100%)',
            backdropFilter:'blur(16px)',
            borderBottom:'1px solid rgba(196,213,240,0.6)',
            boxShadow:'0 1px 8px rgba(79,114,205,0.07)'
          }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-all">
              {sidebarOpen ? <X size={17}/> : <Menu size={17}/>}
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{background:'linear-gradient(135deg,rgba(74,222,128,0.12),rgba(52,211,153,0.08))', border:'1px solid rgba(74,222,128,0.25)'}}>
              <Wifi size={11} className="text-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-600" style={{fontFamily:'DM Sans,sans-serif'}}>MySQL Live</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                <Bell size={17} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 rounded-2xl z-50 overflow-hidden"
                  style={{background:'linear-gradient(145deg,#ffffff,#f8faff)', border:'1px solid rgba(196,213,240,0.7)', boxShadow:'0 20px 60px rgba(79,114,205,0.15)'}}>
                  <div className="px-4 py-3 flex items-center justify-between" style={{borderBottom:'1px solid rgba(196,213,240,0.5)'}}>
                    <span className="text-sm font-semibold text-slate-700" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>Notifications</span>
                    <span className="text-xs text-blue-600 cursor-pointer font-medium" style={{fontFamily:'DM Sans,sans-serif'}}>Mark all read</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y" style={{borderColor:'rgba(196,213,240,0.3)'}}>
                    {notifications.length === 0 && (
                      <div className="py-8 text-center text-sm text-slate-400" style={{fontFamily:'DM Sans,sans-serif'}}>No notifications</div>
                    )}
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => markRead(n.id)}
                        className={`px-4 py-3 cursor-pointer hover:bg-blue-50/50 transition-colors ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            n.type==='alert'?'bg-red-400':n.type==='success'?'bg-emerald-400':
                            n.type==='warning'?'bg-amber-400':'bg-blue-400'}`} />
                          <div>
                            <div className="text-xs font-semibold text-slate-700" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>{n.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5" style={{fontFamily:'DM Sans,sans-serif'}}>{n.message}</div>
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
