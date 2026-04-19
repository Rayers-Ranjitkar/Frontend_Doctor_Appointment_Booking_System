import type { ElementType, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Heart, Bell, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/constants/AuthContext';

export type NavItem = {
  path: string;
  label: string;
  icon: ElementType;
};

type Props = {
  navItems: NavItem[];
  role: 'patient' | 'doctor' | 'admin';
  userName: string;
  userImage?: string;
  userSubtitle?: string;
  children: ReactNode;
};

const roleColors = {
  patient: { gradient: 'from-blue-600 to-cyan-500', active: 'bg-blue-600', text: 'text-blue-400' },
  doctor: { gradient: 'from-emerald-600 to-teal-500', active: 'bg-emerald-600', text: 'text-emerald-400' },
  admin: { gradient: 'from-purple-600 to-violet-500', active: 'bg-purple-600', text: 'text-purple-400' },
};

export default function AppSidebar({ navItems, role, userName, userImage, userSubtitle, children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications, markAllNotificationsRead } = useClinic();
  const { logout } = useAuth();
  const colors = roleColors[role];
  const unread = notifications.filter(n => !n.read).length;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`p-6 bg-gradient-to-br ${colors.gradient}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Heart size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white" style={{ fontWeight: 800, fontSize: '1.1rem' }}>MediBook</p>
            <p className="text-white/70" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{role} Portal</p>
          </div>
        </div>
        {/* User Info */}
        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
          {userImage ? (
            <img src={userImage} alt={userName} className="w-10 h-10 rounded-full object-cover border-2 border-white/30" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white" style={{ fontWeight: 700 }}>
              {userName.charAt(0)}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-white truncate" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{userName}</p>
            {userSubtitle && <p className="text-white/70 truncate" style={{ fontSize: '0.75rem' }}>{userSubtitle}</p>}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== `/${role}` && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive ? `${colors.active} text-white shadow-lg` : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
              <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={18} />
          <span style={{ fontSize: '0.9rem' }}>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 shrink-0 h-full overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-gray-900 flex flex-col overflow-y-auto">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between shrink-0 shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <Menu size={22} />
          </button>
          <div className="hidden lg:block">
            <p className="text-gray-400" style={{ fontSize: '0.85rem' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                <Bell size={20} />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                    {unread}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-gray-900" style={{ fontWeight: 700 }}>Notifications</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                        <div className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                            n.type === 'confirmation' ? 'bg-green-400' :
                            n.type === 'reminder' ? 'bg-blue-400' :
                            n.type === 'cancellation' ? 'bg-red-400' :
                            n.type === 'queue' ? 'bg-amber-400' :
                            n.type === 'payment' ? 'bg-purple-400' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="text-gray-700" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>{n.message}</p>
                            <p className="text-gray-400 mt-1" style={{ fontSize: '0.75rem' }}>{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center">
                    <button onClick={() => { markAllNotificationsRead(); setNotifOpen(false); }} className="text-blue-600 hover:text-blue-800" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white`} style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                {userName.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-gray-900" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{userName.split(' ')[0]}</p>
                <p className="text-gray-400" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>{role}</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden md:block" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
