import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../redux/profileSlice';
import {
  fetchMySubscriptions, fetchInvoices, renewSubscription
} from '../redux/subscriptionSlice';
import {
  User, MapPin, Briefcase, Globe, Phone, Mail,
  Calendar, Award, Building, Link as LinkIcon, Save, X, Edit3,
  Crown, History, Eye, CheckCircle, Printer, CreditCard, Download, RefreshCw
} from 'lucide-react';

const ManageProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: profile } = useSelector(state => state.profile);
  const { active: subscriptions, invoices } = useSelector(state => state.subscription);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const isRecruiter = profile?.role === 'RECRUITER';
  const isAdmin = profile?.role === 'ADMIN';
  const activeSub = subscriptions?.find(s => s.status === 'SUBSCRIBED');

  useEffect(() => {
    if (profile) {
      setEditData(profile);
      if (isRecruiter) {
        dispatch(fetchMySubscriptions());
        dispatch(fetchInvoices());
      }
    }
  }, [profile, dispatch, isRecruiter]);

  const handleUpdate = () => {
    let finalData = { ...editData };
    if (!isRecruiter && !isAdmin && typeof editData.skills === 'string') {
      finalData.skills = editData.skills.split(',').map(s => s.trim()).filter(s => s !== "");
    }
    dispatch(updateProfile(finalData));
    setIsEditing(false);
  };

  if (!profile || !editData) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 pb-20 px-4 sm:px-6 md:px-8 lg:px-12 font-sans antialiased text-slate-900 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">

        {/* 1. TOP HEADER BAR - Fully Responsive */}
        <div className="bg-white rounded-3xl sm:rounded-[2rem] p-5 sm:p-6 mb-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl relative shrink-0 ${activeSub ? 'bg-gradient-to-tr from-amber-400 to-orange-600 shadow-amber-100' : 'bg-slate-900'}`}>
              {profile.fullName ? profile.fullName[0].toUpperCase() : 'A'}
              {activeSub && <Crown size={16} className="absolute -top-2 -right-2 text-amber-500 fill-amber-500" />}
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate max-w-[250px] sm:max-w-none">
                {profile.fullName || 'Administrator'}
              </h1>
              <p className="text-slate-400 font-bold text-[10px] flex flex-wrap justify-center sm:justify-start items-center gap-2 uppercase tracking-widest mt-1.5">
                {isAdmin ? <span className="text-rose-600">Admin Access</span> : (activeSub ? <span className="text-amber-600">Premium Recruiter</span> : profile.role)}
                <span className="hidden sm:block h-1 w-1 bg-slate-200 rounded-full" /> 
                <span className="truncate max-w-[200px] sm:max-w-none">{profile.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {isRecruiter && (
              <button onClick={() => navigate('/billing')} className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition">
                <CreditCard size={14} /> Billing
              </button>
            )}

            {isEditing ? (
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setIsEditing(false)} className="flex-1 px-4 py-3 font-black text-[10px] uppercase text-slate-400 tracking-widest">Cancel</button>
                <button onClick={handleUpdate} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100"><Save size={14} /> Save</button>
              </div>
            ) : (
              !isAdmin && (
                <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto px-10 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"><Edit3 size={14} /> Edit Profile</button>
              )
            )}
          </div>
        </div>

        {/* 2. MAIN CONTENT GRID */}
        <div className={`grid grid-cols-1 ${isAdmin ? '' : 'lg:grid-cols-12'} gap-6`}>

          {/* Left Column - Account Identity */}
          <div className={`${isAdmin ? 'max-w-xl mx-auto w-full' : 'lg:col-span-4'} space-y-6`}>
            <Section title="Account Identity" icon={<User size={16} />} color="blue">
              <InputField label="Full Name" icon={User} value={editData.fullName} name="fullName" isEditing={isEditing} onChange={setEditData} data={editData} />
              <InputField label="Email Address" icon={Mail} value={profile.email} name="email" isEditing={false} onChange={()=>{}} data={editData} />
              
              {!isAdmin && (
                <>
                  <InputField label="Mobile No" icon={Phone} value={editData.mobile} name="mobile" type="number" isEditing={isEditing} onChange={setEditData} data={editData} />
                  {!isRecruiter && (
                    <>
                      <InputField label="Birthday" icon={Calendar} value={editData.dob?.split('T')[0]} name="dob" type="date" isEditing={isEditing} onChange={setEditData} data={editData} />
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1"><Award size={12} /> Gender</label>
                        {isEditing ? (
                          <select className="w-full p-3 bg-slate-50 border-none rounded-xl text-xs font-bold shadow-inner" value={editData.gender} onChange={e => setEditData({ ...editData, gender: e.target.value })}>
                            <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                          </select>
                        ) : <p className="text-xs font-black text-slate-700 py-1">{profile.gender || '—'}</p>}
                      </div>
                    </>
                  )}
                </>
              )}
            </Section>

            {isRecruiter && !isAdmin && (
              <Section title="Subscription" icon={<Crown size={16} />} color="amber">
                {activeSub ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Status: Active</p>
                      <p className="text-base font-black text-slate-900">{activeSub.plan}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">Ends {new Date(activeSub.endDate).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => navigate('/billing')} className="w-full py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition">Manage Billing</button>
                  </div>
                ) : (
                  <button onClick={() => navigate('/subscription')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100">Upgrade to Pro</button>
                )}
              </Section>
            )}
          </div>

          {/* Right Column - Address & Pro Details (Hidden for Admins) */}
          {!isAdmin && (
            <div className="lg:col-span-8 space-y-6">
              <Section title="Residency & Address" icon={<MapPin size={16} />} color="slate">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <InputField label="House/Unit No" value={editData.address?.houseNo} name="houseNo" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
                  <InputField label="Street" value={editData.address?.street} name="street" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
                  <InputField label="City" value={editData.address?.city} name="city" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="State" value={editData.address?.state} name="state" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
                    <InputField label="Pincode" value={editData.address?.pincode} name="pincode" type="number" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
                  </div>
                </div>
              </Section>

              <Section title={isRecruiter ? "Company Details" : "Professional Portfolio"} icon={isRecruiter ? <Building size={16} /> : <Briefcase size={16} />} color="indigo">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {isRecruiter ? (
                    <>
                      <InputField label="Company Name" value={editData.companyName} name="companyName" isEditing={isEditing} onChange={setEditData} data={editData} icon={Building} />
                      <InputField label="Industry" value={editData.industry} name="industry" isEditing={isEditing} onChange={setEditData} data={editData} icon={Globe} />
                      <InputField label="Company Size" value={editData.companySize} name="companySize" isEditing={isEditing} onChange={setEditData} data={editData} icon={User} />
                      <InputField label="Official Website" value={editData.website} name="website" isEditing={isEditing} onChange={setEditData} data={editData} icon={LinkIcon} />
                    </>
                  ) : (
                    <>
                      <div className="col-span-full">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-2"><Award size={12} /> Expertise & Skills</label>
                        {isEditing ? (
                          <textarea className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold shadow-inner" placeholder="Java, React..." value={Array.isArray(editData.skills) ? editData.skills.join(', ') : editData.skills} onChange={e => setEditData({ ...editData, skills: e.target.value })} rows="3" />
                        ) : (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {profile.skills?.length > 0 ? profile.skills.map((s, i) => <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-lg border border-indigo-100 uppercase">{s}</span>) : <span className="text-xs text-slate-400 font-bold">No skills added</span>}
                          </div>
                        )}
                      </div>
                      <InputField label="Experience (Years)" value={editData.experience} name="experience" type="number" isEditing={isEditing} onChange={setEditData} data={editData} icon={Briefcase} />
                      <InputField label="Resume Link" value={editData.resumeUrl} name="resumeUrl" isEditing={isEditing} onChange={setEditData} data={editData} icon={LinkIcon} />
                    </>
                  )}
                </div>
              </Section>

              {isRecruiter && invoices?.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest"><History size={16} /> Recent Payments</h3>
                    <button onClick={() => navigate('/billing')} className="text-[9px] font-black text-blue-600 uppercase border-b-2 border-blue-600 pb-0.5 whitespace-nowrap">View History</button>
                  </div>
                  <div className="space-y-3">
                    {[...invoices].reverse().slice(0, 3).map(inv => (
                      <div key={inv.invoiceID} onClick={() => setSelectedInvoice(inv)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 cursor-pointer transition group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm group-hover:scale-110 transition-transform"><CheckCircle size={16} /></div>
                          <div><p className="text-xs font-black text-slate-900">₹{inv.amount}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(inv.paymentDate).toLocaleDateString()}</p></div>
                        </div>
                        <Eye size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* INVOICE MODAL - Same refined logic */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedInvoice(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            <div className="p-8 pb-6 border-b border-dashed border-slate-200 text-center sm:text-left">
              <h2 className="text-xl font-black text-slate-900">Tax Invoice</h2>
              <p className="text-slate-400 text-[9px] font-bold uppercase mt-1 tracking-widest">ID: #{selectedInvoice.invoiceID}</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-500">Premium Plan</span><span className="text-lg font-black text-blue-600">₹{selectedInvoice.amount}</span></div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"><Printer size={14} /> Print</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// UI SUB-COMPONENTS
const Section = ({ title, icon, color, children }) => (
  <div className="bg-white p-6 sm:p-7 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
    <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500`} />
    <h3 className="text-[10px] font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-[0.2em] leading-none">{icon} {title}</h3>
    <div className="space-y-5">{children}</div>
  </div>
);

const InputField = ({ label, icon: Icon, value, name, type = "text", nested = null, isEditing, onChange, data }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1 whitespace-nowrap">
      <Icon size={12} className="text-blue-500 shrink-0" /> {label}
    </label>
    {isEditing ? (
      <input type={type} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-blue-600 outline-none transition text-xs font-bold text-slate-700 shadow-inner" value={value || ''} onChange={(e) => {
        if (nested) { onChange({ ...data, [nested]: { ...data[nested], [name]: e.target.value } }); }
        else { onChange({ ...data, [name]: e.target.value }); }
      }} />
    ) : (
      <p className="text-xs font-black text-slate-700 py-1 px-1 break-all">{value || '—'}</p>
    )}
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-blue-600"></div>
    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Account</p>
  </div>
);

export default ManageProfile;