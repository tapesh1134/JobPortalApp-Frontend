import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJobById, updateJobDetails } from '../redux/jobSlice';
import { 
    Briefcase, MapPin, DollarSign, Target, Plus, X, 
    ChevronLeft, Save, Sparkles, Layers, Clock, 
    RotateCcw, Info
} from 'lucide-react';

const EditJob = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedJob, loading: fetching } = useSelector((state) => state.jobs);
    const [skillInput, setSkillInput] = useState('');
    const [formData, setFormData] = useState({
        title: '', category: '', type: 'FULL_TIME', location: '', 
        salaryMin: '', salaryMax: '', experienceRequired: '', skills: [], status: 'OPEN'
    });

    useEffect(() => {
        dispatch(fetchJobById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedJob && selectedJob.jobId.toString() === id) {
            setFormData({
                title: selectedJob.title,
                category: selectedJob.category,
                type: selectedJob.type,
                location: selectedJob.location,
                salaryMin: selectedJob.salaryMin,
                salaryMax: selectedJob.salaryMax,
                experienceRequired: selectedJob.experienceRequired,
                skills: selectedJob.skills || []
            });
        }
    }, [selectedJob, id]);

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(skillInput.trim())) {
                setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
            }
            setSkillInput('');
        }
    };

    const removeSkill = (index) => {
        setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateJobDetails({ jobId: id, jobData: formData }));
        if (updateJobDetails.fulfilled.match(result)) navigate('/dashboard');
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Retrieving Listing...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-15 pb-15 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* HEADER & NAVIGATION */}
                <div className="mb-10">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition font-bold text-sm mb-6 group"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Cancel Editing
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <RotateCcw size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Management Console</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Edit Posting</h1>
                            <p className="text-slate-500 font-medium">Refining: <span className="text-slate-900 font-bold">"{formData.title}"</span></p>
                        </div>
                        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl border border-amber-100">
                            <Info size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Active ID: #{id}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* SECTION 1: CORE DETAILS */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                                <Briefcase size={20} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Core Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                                label="Job Title" 
                                icon={<Briefcase size={16}/>}
                                value={formData.title} 
                                onChange={v => setFormData({...formData, title: v})} 
                                required 
                            />
                            <InputField 
                                label="Category" 
                                icon={<Layers size={16}/>}
                                value={formData.category} 
                                onChange={v => setFormData({...formData, category: v})} 
                                required 
                            />
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-600 transition appearance-none cursor-pointer" 
                                        value={formData.type} 
                                        onChange={e => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="FULL_TIME">Full Time</option>
                                        <option value="PART_TIME">Part Time</option>
                                        <option value="CONTRACT">Contract</option>
                                        <option value="INTERNSHIP">Internship</option>
                                    </select>
                                </div>
                            </div>
                            <InputField 
                                label="Location" 
                                icon={<MapPin size={16}/>}
                                value={formData.location} 
                                onChange={v => setFormData({...formData, location: v})} 
                                required 
                            />
                        </div>
                    </div>

                    {/* SECTION 2: FINANCE */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100">
                                <DollarSign size={20} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Salary & Experience</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField label="Min Salary" type="number" value={formData.salaryMin} onChange={v => setFormData({...formData, salaryMin: v})} required />
                            <InputField label="Max Salary" type="number" value={formData.salaryMax} onChange={v => setFormData({...formData, salaryMax: v})} required />
                            <InputField label="Experience" type="number" value={formData.experienceRequired} onChange={v => setFormData({...formData, experienceRequired: v})} required />
                        </div>
                    </div>

                    {/* SECTION 3: SKILLS */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-100">
                                <Target size={20} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Requirement Update</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="relative group">
                                <Plus size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input 
                                    type="text" 
                                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-600 transition"
                                    placeholder="Add skill and press Enter..."
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {formData.skills.map((skill, index) => (
                                    <span key={index} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition-all group">
                                        {skill}
                                        <X 
                                            size={14} 
                                            className="cursor-pointer opacity-50 group-hover:opacity-100" 
                                            onClick={() => removeSkill(index)} 
                                        />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button 
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 py-5 rounded-[2rem] font-black text-slate-400 hover:bg-slate-100 transition uppercase tracking-widest text-[10px]"
                        >
                            Discard Changes
                        </button>
                        <button className="flex-[2] bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-3">
                            <Save size={20} /> Apply Updates
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputField = ({ label, value, onChange, placeholder, icon, type = "text", required = false }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
            <input 
                type={type} 
                required={required}
                className={`w-full ${icon ? 'pl-12' : 'px-5'} pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-600 transition`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    </div>
);

export default EditJob;