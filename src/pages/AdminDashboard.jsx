import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminAnalytics } from '../redux/analyticsSlice';
import { fetchAllProfiles, adminDeleteProfile } from '../redux/profileSlice';
import { fetchAdminAllInvoices } from '../redux/subscriptionSlice';
import {
    Users, Briefcase, Send, CheckCircle, XCircle,
    TrendingUp, RefreshCcw, ShieldCheck, Search,
    Trash2, Eye, MapPin, Globe, Mail,
    Calendar, Building2, Phone,
    UserCheck, FileText, ExternalLink, 
    Receipt, DollarSign, ArrowUpRight, History, 
    CalendarDays
} from 'lucide-react';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    
    // Redux State
    const { data: stats = {} } = useSelector(state => state.analytics);
    const { allProfiles = [], loading: profilesLoading } = useSelector(state => state.profile);
    const { adminInvoices = [], loading: billingLoading } = useSelector(state => state.subscription);

    // UI State
    const [activeTab, setActiveTab] = useState('USERS'); // 'USERS' or 'FINANCIALS'
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    useEffect(() => {
        dispatch(fetchAdminAnalytics());
        dispatch(fetchAllProfiles());
        dispatch(fetchAdminAllInvoices());
    }, [dispatch]);

    // --- LOGIC ---

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this profile? This cannot be undone.")) {
            dispatch(adminDeleteProfile(userId));
        }
    };

    const totalRevenue = useMemo(() => {
        return adminInvoices.reduce((acc, curr) => acc + curr.amount, 0);
    }, [adminInvoices]);

    const filteredUsers = useMemo(() => {
        return allProfiles.filter(user => {
            const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
            const nameMatch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
            const emailMatch = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesRole && (nameMatch || emailMatch);
        });
    }, [allProfiles, roleFilter, searchQuery]);

    // --- RENDER HELPERS ---

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* 1. KPI SECTION */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <AdminStatCard icon={<Users />} label="Total Users" value={allProfiles.length} color="blue" />
                    <AdminStatCard icon={<DollarSign />} label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="emerald" />
                    <AdminStatCard icon={<Receipt />} label="Transactions" value={adminInvoices.length} color="purple" />
                    <AdminStatCard icon={<ArrowUpRight />} label="Avg. Ticket" value={`₹${adminInvoices.length ? (totalRevenue / adminInvoices.length).toFixed(0) : 0}`} color="indigo" />
                </div>

                {/* 2. NAVIGATION & TABS */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-200">
                    <div className="flex gap-6">
                        {['USERS', 'FINANCIALS'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 px-2 text-xs font-black tracking-widest transition-all ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab === 'USERS' ? 'USER MANAGEMENT' : 'PLATFORM FINANCIALS'}
                            </button>
                        ))}
                    </div>
                    
                    {activeTab === 'USERS' && (
                        <div className="flex items-center gap-3 pb-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Search users..." 
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select 
                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="CANDIDATE">Candidates</option>
                                <option value="RECRUITER">Recruiters</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* 3. MAIN CONTENT TABLES */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                    {activeTab === 'USERS' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredUsers.map(user => (
                                        <tr key={user.profileId} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100">
                                                        {user.fullName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{user.fullName}</p>
                                                        <p className="text-xs text-slate-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[9px] font-black tracking-tighter uppercase border ${user.role === 'RECRUITER' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                                {user.address?.city || 'Location N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setSelectedUser(user)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(user.profileId)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recruiter</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {adminInvoices.map(invoice => (
                                        <tr key={invoice.invoiceID} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded font-bold">#{invoice.transactionId?.slice(0, 10)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-700">{invoice.recruiterEmail}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400">
                                                {new Date(invoice.paymentDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-emerald-600 font-black">₹{invoice.amount}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL SECTION --- */}
            {selectedUser && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6">
                    <div className="bg-white w-full max-w-3xl h-full max-h-[85vh] md:max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">

                        {/* HEADER */}
                        <div className={`p-6 md:p-8 text-white flex justify-between items-center shrink-0 ${selectedUser.role === 'RECRUITER' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`}>
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black border border-white/30 shrink-0">
                                    {selectedUser.fullName?.[0]}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl md:text-2xl font-black tracking-tight truncate">{selectedUser.fullName}</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="bg-white/20 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-white/10">
                                            {selectedUser.role}
                                        </span>
                                        <span className="text-white/60 text-[10px] font-bold">#{selectedUser.profileId}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <XCircleIcon />
                            </button>
                        </div>

                        {/* SCROLLABLE CONTENT */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Details</h3>
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <InfoGroup icon={<Mail />} label="Email" value={selectedUser.email} />
                                    <InfoGroup icon={<Phone />} label="Mobile" value={selectedUser.mobile} />
                                    <InfoGroup
                                        icon={<MapPin />}
                                        label="City"
                                        value={selectedUser.address?.city ? `${selectedUser.address.city}, ${selectedUser.address.state}` : 'N/A'}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50/80 rounded-[2rem] p-6 md:p-8 border border-slate-100">
                                {selectedUser.role === 'RECRUITER' ? (
                                    <div className="space-y-6">
                                        <h3 className="text-amber-600 text-[10px] font-black uppercase tracking-[0.2em]">Recruiter Profile</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                            <InfoGroup icon={<Building2 />} label="Company" value={selectedUser.companyName} />
                                            <InfoGroup icon={<Users />} label="Size" value={selectedUser.companySize} />
                                            <InfoGroup icon={<Globe />} label="Industry" value={selectedUser.industry} />
                                            <InfoGroup
                                                icon={<ExternalLink />}
                                                label="Website"
                                                value={<a href={selectedUser.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{selectedUser.website}</a>}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <h3 className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">Candidate Profile</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                            <InfoGroup icon={<Calendar />} label="DOB" value={selectedUser.dob} />
                                            <InfoGroup icon={<UserCheck />} label="Gender" value={selectedUser.gender} />
                                            <InfoGroup icon={<Briefcase />} label="Experience" value={`${selectedUser.experience} Years`} />
                                            <InfoGroup
                                                icon={<FileText />}
                                                label="Resume"
                                                value={selectedUser.resumeUrl ?
                                                    <a href={selectedUser.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg text-xs">View Doc</a> :
                                                    'No Resume'}
                                            />
                                        </div>
                                        <div className="pt-4 border-t border-slate-200">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Skills</label>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedUser.skills?.map((s, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="p-6 md:p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="flex items-center gap-2 text-rose-500 opacity-80 text-[10px] font-black uppercase">
                                <ShieldCheck size={14} /> Security Restriction Active
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button onClick={() => setSelectedUser(null)} className="flex-1 sm:flex-none px-6 py-3 font-black text-slate-400 text-sm">Discard</button>
                                <button
                                    onClick={() => { handleDelete(selectedUser.profileId); setSelectedUser(null); }}
                                    className="flex-[2] sm:flex-none px-6 py-3 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 shadow-lg text-sm flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENTS ---

const AdminStatCard = ({ icon, label, value, color }) => {
    const colors = {
        blue: "text-blue-600 bg-white border-blue-100",
        indigo: "text-indigo-600 bg-white border-indigo-100",
        purple: "text-purple-600 bg-white border-purple-100",
        emerald: "text-emerald-600 bg-white border-emerald-100",
    };

    return (
        <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col items-center transition-all hover:-translate-y-1 ${colors[color]}`}>
            <div className="mb-2 opacity-60">{icon}</div>
            <span className="text-[9px] font-black uppercase tracking-widest mb-1">{label}</span>
            <span className="text-2xl font-black text-slate-900">{value}</span>
        </div>
    );
};

const InfoGroup = ({ icon, label, value }) => (
    <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 text-slate-400">
            {React.cloneElement(icon, { size: 13, strokeWidth: 3 })}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-slate-900 font-bold text-sm truncate">
            {value || <span className="text-slate-300 italic">Not Set</span>}
        </div>
    </div>
);

const XCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
);

export default AdminDashboard;