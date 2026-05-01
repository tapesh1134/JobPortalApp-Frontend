import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead, markAllRead, deleteNotification } from '../redux/notificationSlice';
import { Bell, Trash2, CheckCheck, Calendar, Info, Briefcase, AlertCircle, Loader2 } from 'lucide-react';

const NotificationsPage = () => {
    const { items, unreadCount, loading } = useSelector(state => state.notifications);
    const dispatch = useDispatch();

    const getIcon = (message = "") => {
        const msg = message.toUpperCase();
        if (msg.includes('JOB') || msg.includes('APPLICATION')) return <Briefcase size={18} />;
        if (msg.includes('SYSTEM') || msg.includes('UPDATE')) return <Info size={18} />;
        return <AlertCircle size={18} />;
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Notifications</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            {unreadCount > 0 
                                ? `You have ${unreadCount} unread messages` 
                                : "You're all caught up!"}
                        </p>
                    </div>
                    {items.length > 0 && (
                        <button 
                            onClick={() => dispatch(markAllRead())}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                            <CheckCheck size={16} /> Mark all read
                        </button>
                    )}
                </div>

                {loading && items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Loading inbox...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                            <Bell className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Inbox Empty</h3>
                        <p className="text-slate-500 mt-2 text-sm">We'll notify you when something important happens.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((note) => (
                            <div 
                                key={note.notificationId}
                                className={`group relative bg-white p-6 rounded-[2rem] border transition-all duration-300 flex gap-5 ${
                                    !note.read 
                                    ? 'border-blue-100 shadow-xl shadow-blue-900/5 ring-1 ring-blue-50' 
                                    : 'border-slate-100 opacity-80 hover:opacity-100'
                                }`}
                            >
                                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                                    !note.read ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {getIcon(note.message)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                                                Update
                                            </span>
                                            {!note.read && (
                                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                                <Calendar size={12} />
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </span>
                                            <button 
                                                onClick={() => dispatch(deleteNotification(note.notificationId))}
                                                className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <p className={`text-sm md:text-base leading-relaxed mb-4 ${
                                        !note.read ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'
                                    }`}>
                                        {note.message}
                                    </p>

                                    {!note.read && (
                                        <button 
                                            onClick={() => dispatch(markAsRead(note.notificationId))}
                                            className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;