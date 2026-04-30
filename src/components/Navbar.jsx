import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { fetchMySubscriptions } from '../redux/subscriptionSlice';
import { fetchNotifications, addNotification, markAsRead } from '../redux/notificationSlice';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {
  Briefcase, LogOut, LayoutDashboard,
  Bell, Search, Menu, X, ChevronRight, Plus,
  FileCode, ExternalLink, Zap
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { active: subscriptions } = useSelector((state) => state.subscription);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const isRecruiter = user?.role === 'RECRUITER';
  const hasActiveSubscription = subscriptions?.some(sub => sub.status === 'SUBSCRIBED');
  const DOCS_URL = "http://localhost:8080/webjars/swagger-ui/index.html";

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    if (isAuthenticated) {
      if (isRecruiter) dispatch(fetchMySubscriptions());
      dispatch(fetchNotifications());
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, isAuthenticated, isRecruiter]);

  // FIX: Robust WebSocket Connection Logic
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;

    const userEmail = user.email.toLowerCase();
    // Ensure the URL matches your Gateway exactly
    const socket = new SockJS("http://localhost:8080/api/notifications/ws-notifications");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        const topic = `/topic/notifications/${userEmail}`;
        console.log("✅ WS Connected. Subscribing to:", topic);

        client.subscribe(topic, (msg) => {
          // THIS LOG IS CRITICAL - If you don't see this, the message didn't reach the browser
          console.log("🔔 MESSAGE RECEIVED IN BROWSER:", msg.body);

          try {
            const newNotif = JSON.parse(msg.body);
            dispatch(addNotification(newNotif));
          } catch (err) {
            console.error("❌ Failed to parse notification body", err);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
    });

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
        console.log("🔌 WS Disconnected");
      }
    };
  }, [isAuthenticated, user?.email, dispatch]);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowNotifDropdown(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`fixed w-full z-[100] transition-all duration-500 flex justify-center ${isScrolled ? 'top-4' : 'top-0'}`}>
        <div className={`transition-all duration-500 flex items-center justify-between px-6 h-16 ${isScrolled
            ? 'w-[95%] md:w-[92%] max-w-7xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-[2rem] border border-white/20'
            : 'w-full max-w-7xl bg-white border-b border-slate-100'
          }`}>

          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="bg-slate-900 p-2 rounded-xl group-hover:bg-blue-600 transition-all">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase hidden lg:block">
                Job<span className="text-blue-600">Portal</span>
              </span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                <DesktopNavLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard size={14} />}>Dashboard</DesktopNavLink>
                <DesktopNavLink to="/jobs" active={isActive('/jobs')} icon={<Search size={14} />}>Browse</DesktopNavLink>
                {isRecruiter && (
                  <DesktopNavLink to="/post-job" active={isActive('/post-job')} icon={<Plus size={14} />}>Post Job</DesktopNavLink>
                )}
                {/* DOCS BUTTON */}
                <a href={DOCS_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                  <FileCode size={14} /> Docs
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* UPGRADE NUDGE */}
                {isRecruiter && !hasActiveSubscription && (
                  <button onClick={() => navigate('/subscription')} className="hidden xl:flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all">
                    <Zap size={14} fill="currentColor" /> Upgrade
                  </button>
                )}

                {/* NOTIFICATIONS */}
                <div className="relative">
                  <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className={`p-2.5 rounded-full transition-all relative ${showNotifDropdown ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-blue-50'}`}>
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Notifications</span>
                        <Link to="/notifications" className="text-[10px] font-black uppercase text-blue-600">View All</Link>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-10 text-center text-slate-400 uppercase font-black text-[10px]">Empty</div>
                        ) : (
                          notifications.slice(0, 5).map(n => (
                            <div key={n.notificationId} onClick={() => { if (!n.read) dispatch(markAsRead(n.notificationId)); navigate('/notifications'); }} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 relative ${!n.read ? 'bg-blue-50/30 font-bold' : ''}`}>
                              {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
                              <p className="text-xs line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* PROFILE & LOGOUT */}
                <div className="hidden md:flex items-center gap-2 p-1 pl-2 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div onClick={() => navigate('/manage-profile')} className="flex items-center gap-2 cursor-pointer pr-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md ${hasActiveSubscription ? 'bg-amber-500' : 'bg-blue-600'}`}>
                      {user?.email[0].toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className={`text-[8px] font-black uppercase tracking-[0.15em] mb-0.5 ${hasActiveSubscription ? 'text-amber-600' : 'text-blue-600'}`}>
                        {hasActiveSubscription ? 'PREMIUM' : user?.role}
                      </p>
                      <p className="text-xs font-bold text-slate-700 max-w-[80px] truncate">{user?.email.split('@')[0]}</p>
                    </div>
                  </div>
                  <button onClick={() => dispatch(logoutUser()).then(() => navigate('/'))} className="p-2 text-slate-400 hover:text-rose-600 transition">
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="px-5 py-2 text-xs font-black text-slate-500 uppercase tracking-widest">Login</Link>
                <Link to="/signup" className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all">Join Now</Link>
              </div>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-900 bg-slate-100 rounded-xl">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`md:hidden absolute top-[110%] left-0 w-full px-4 transition-all duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 space-y-4">
            <MobileNavLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <a href={DOCS_URL} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 text-slate-700 font-black text-xs uppercase tracking-widest bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3"><FileCode size={20} /> API Docs</div>
              <ExternalLink size={16} />
            </a>
            <button onClick={() => dispatch(logoutUser())} className="w-full flex items-center gap-3 p-4 text-rose-600 font-black text-xs uppercase tracking-widest bg-rose-50 rounded-2xl">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </nav>
      {showNotifDropdown && <div className="fixed inset-0 z-[90]" onClick={() => setShowNotifDropdown(false)} />}
    </>
  );
};

const DesktopNavLink = ({ to, children, active, icon }) => (
  <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>
    {icon} {children}
  </Link>
);

const MobileNavLink = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center justify-between p-4 text-slate-700 font-black text-xs uppercase tracking-widest bg-slate-50 rounded-2xl">
    <div className="flex items-center gap-3">{icon} <span>{label}</span></div>
    <ChevronRight size={16} />
  </Link>
);

export default Navbar;