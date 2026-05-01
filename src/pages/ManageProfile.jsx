import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 1. Import Navigate
import { updateProfile } from '../redux/profileSlice';
import {
  fetchMySubscriptions, fetchInvoices, cancelSubscription,
  renewSubscription
} from '../redux/subscriptionSlice';
import {
  User, MapPin, Briefcase, Globe, Phone, Mail,
  Calendar, Award, Building, Link as LinkIcon, Save, X, Edit3,
  Crown, History, Download, RefreshCw, Eye, CheckCircle, Printer, CreditCard
} from 'lucide-react';

const ManageProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 2. Initialize Navigate

  const { data: profile } = useSelector(state => state.profile);
  const { active: subscriptions, invoices } = useSelector(state => state.subscription);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const isRecruiter = profile?.role === 'RECRUITER';
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
    if (!isRecruiter && typeof editData.skills === 'string') {
      finalData.skills = editData.skills.split(',').map(s => s.trim()).filter(s => s !== "");
    }
    dispatch(updateProfile(finalData));
    setIsEditing(false);
  };

  if (!profile || !editData) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-12 pb-20 px-4 md:px-8 lg:px-12 font-sans antialiased text-slate-900">
      <div className="max-w-6xl mx-auto">

        {/* 1. TOP HEADER BAR */}
        <div className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl relative ${activeSub ? 'bg-gradient-to-tr from-amber-400 to-orange-600 shadow-amber-100' : 'bg-slate-900'}`}>
              {profile.fullName[0].toUpperCase()}
              {activeSub && <Crown size={16} className="absolute -top-2 -right-2 text-amber-500 fill-amber-500" />}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{profile.fullName}</h1>
              <p className="text-slate-400 font-bold text-[10px] flex items-center gap-2 uppercase tracking-widest mt-1.5">
                {activeSub ? <span className="text-amber-600">Premium Recruiter</span> : profile.role}
                <span className="h-1 w-1 bg-slate-200 rounded-full" /> {profile.email}
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {/* 3. Added Billing Center Route Button */}
            {isRecruiter && (
              <button
                onClick={() => navigate('/billing')}
                className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition"
              >
                <CreditCard size={14} /> Billing Center
              </button>
            )}

            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="flex-1 md:flex-none px-6 py-3 font-black text-[10px] uppercase text-slate-400 tracking-widest">Cancel</button>
                <button onClick={handleUpdate} className="flex-1 md:flex-none px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100"><Save size={14} /> Save</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex-1 md:flex-none px-10 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"><Edit3 size={14} /> Edit Profile</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-4 space-y-6">
            <Section title="Account Identity" icon={<User size={16} />} color="blue">
              <InputField label="Full Name" icon={User} value={editData.fullName} name="fullName" isEditing={isEditing} onChange={setEditData} data={editData} />
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
            </Section>

            {isRecruiter && (
              <Section title="Subscription" icon={<Crown size={16} />} color="amber">
                {activeSub ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Status: Active</p>
                      <p className="text-base font-black text-slate-900">{activeSub.plan}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">Valid until {new Date(activeSub.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <button onClick={() => dispatch(renewSubscription(activeSub.subscriptionId))} className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"><RefreshCw size={12} /> Renew Plan</button>
                      <button
                        onClick={() => navigate('/billing')}
                        className="w-full py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition"
                      >
                        Manage Invoices
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => navigate('/subscription')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100">Upgrade to Pro</button>
                )}
              </Section>
            )}
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Section title="Residency & Address" icon={<MapPin size={16} />} color="slate">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <InputField label="House/Unit No" value={editData.address.houseNo} name="houseNo" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
                <InputField label="Street" value={editData.address.street} name="street" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
                <InputField label="City" value={editData.address.city} name="city" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="State" value={editData.address.state} name="state" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
                  <InputField label="Pincode" value={editData.address.pincode} name="pincode" type="number" nested="address" isEditing={isEditing} onChange={setEditData} data={editData} icon={MapPin} />
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
                          {profile.skills?.map((s, i) => <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-lg border border-indigo-100 uppercase">{s}</span>)}
                        </div>
                      )}
                    </div>
                    <InputField label="Years of Experience" value={editData.experience} name="experience" type="number" isEditing={isEditing} onChange={setEditData} data={editData} icon={Briefcase} />
                    <InputField label="Public Resume Link" value={editData.resumeUrl} name="resumeUrl" isEditing={isEditing} onChange={setEditData} data={editData} icon={LinkIcon} />
                  </>
                )}
              </div>
            </Section>

            {/* QUICK INVOICE ACCESS */}
            {isRecruiter && (
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest"><History size={16} /> Recent Payments</h3>
                  <button onClick={() => navigate('/billing')} className="text-[9px] font-black text-blue-600 uppercase border-b-2 border-blue-600 pb-0.5">Full Billing History</button>
                </div>
                <div className="space-y-3">
                  {[...(invoices || [])]
                    .reverse()
                    .slice(0, 3)
                    .map(inv => (
                      <div key={inv.invoiceID} onClick={() => setSelectedInvoice(inv)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 cursor-pointer transition">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm"><CheckCircle size={16} /></div>
                          <div><p className="text-xs font-black text-slate-900">₹{inv.amount}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(inv.paymentDate).toLocaleDateString()}</p></div>
                        </div>
                        <Eye size={16} className="text-slate-300" />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INVOICE CARD MODAL (Same as previous version) */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/20">
            <button onClick={() => setSelectedInvoice(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
            <div className="p-10 pb-6 border-b border-dashed border-slate-200">
              <div className="bg-slate-900 p-2 rounded-xl w-fit mb-6"><Briefcase className="w-6 h-6 text-white" /></div>
              <h2 className="text-xl font-black text-slate-900">Tax Invoice</h2>
              <p className="text-slate-400 text-[9px] font-bold uppercase mt-1 tracking-widest">ID: #{selectedInvoice.invoiceID}</p>
              <div className="mt-6 flex justify-between">
                <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">To</p><p className="text-xs font-bold">{selectedInvoice.recruiterEmail}</p></div>
                <div className="text-right"><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Date</p><p className="text-xs font-bold">{new Date(selectedInvoice.paymentDate).toLocaleDateString()}</p></div>
              </div>
            </div>
            <div className="p-10 space-y-6">
              <div className="flex justify-between text-sm font-bold text-slate-600"><span>Recruiter Premium Plan</span><span>₹{selectedInvoice.amount}</span></div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center"><span className="text-base font-black text-slate-900">Total</span><span className="text-2xl font-black text-blue-600">₹{selectedInvoice.amount}</span></div>
              <div className="bg-slate-50 p-4 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Transaction ID</p><p className="text-[10px] font-mono text-slate-500 break-all">{selectedInvoice.transactionId}</p></div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => window.print()} className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"><Printer size={14} /> Print</button>
                <button className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"><Download size={14} /> PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, icon, color, children }) => (
  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
    <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500`} />
    <h3 className="text-[10px] font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-[0.2em] leading-none">{icon} {title}</h3>
    <div className="space-y-5">{children}</div>
  </div>
);

const InputField = ({ label, icon: Icon, value, name, type = "text", nested = null, isEditing, onChange, data }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
      <Icon size={12} className="text-blue-500" /> {label}
    </label>
    {isEditing ? (
      <input type={type} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-blue-600 outline-none transition text-xs font-bold text-slate-700 shadow-inner" value={value || ''} onChange={(e) => {
        if (nested) { onChange({ ...data, [nested]: { ...data[nested], [name]: e.target.value } }); }
        else { onChange({ ...data, [name]: e.target.value }); }
      }} />
    ) : (
      <p className="text-xs font-black text-slate-700 py-1 px-1">{value || '—'}</p>
    )}
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-blue-600"></div>
    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Accessing Profile</p>
  </div>
);

export default ManageProfile;