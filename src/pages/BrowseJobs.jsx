import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, searchJobs } from '../redux/jobSlice';
import { Search, MapPin, Briefcase, DollarSign, Filter, X, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const BrowseJobs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list: jobs = [], loading = false } = useSelector((state) => state.jobs || {});
    const [showFilters, setShowFilters] = useState(false);
    
    const [filters, setFilters] = useState({
        title: '', location: '', category: '', minSalary: '', maxSalary: '', experienceRequired: ''
    });

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        const cleanedFilters = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null) {
                if (['minSalary', 'maxSalary', 'experienceRequired'].includes(key)) {
                    cleanedFilters[key] = Number(value);
                } else {
                    cleanedFilters[key] = value;
                }
            }
        });
        dispatch(searchJobs(cleanedFilters));
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({ title: '', location: '', category: '', minSalary: '', maxSalary: '', experienceRequired: '' });
        dispatch(fetchJobs());
    };

    return (
        /* Reduced top padding from pt-24 to pt-12 */
        <div className="min-h-screen bg-[#f8fafc] pt-12 px-4 pb-12 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

                {/* Sidebar Filter - Reduced padding and text sizes */}
                <aside className={`
                    lg:w-1/4 w-full bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 h-fit sticky top-12 transition-all z-40
                    ${showFilters ? 'fixed inset-0 pt-12 overflow-y-auto rounded-none lg:relative lg:pt-6 lg:rounded-[2rem]' : 'hidden lg:block'}
                `}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-slate-900 flex items-center gap-2 text-lg tracking-tight">
                            <Filter className="w-4 h-4 text-blue-600" /> Filters
                        </h3>
                        <div className="flex gap-4">
                            <button onClick={clearFilters} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Reset</button>
                            {showFilters && <button onClick={() => setShowFilters(false)} className="lg:hidden"><X size={18} /></button>}
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <FilterInput label="Position" value={filters.title} onChange={v => setFilters({ ...filters, title: v })} placeholder="e.g. Designer" />
                        <FilterInput label="Location" value={filters.location} onChange={v => setFilters({ ...filters, location: v })} placeholder="e.g. Remote" />
                        <FilterInput label="Category" value={filters.category} onChange={v => setFilters({ ...filters, category: v })} placeholder="e.g. IT" />

                        <div className="grid grid-cols-2 gap-2">
                            <FilterInput label="Min Pay" value={filters.minSalary} onChange={v => setFilters({ ...filters, minSalary: v })} type="number" placeholder="0" />
                            <FilterInput label="Max Pay" value={filters.maxSalary} onChange={v => setFilters({ ...filters, maxSalary: v })} type="number" placeholder="Max" />
                        </div>
                        <FilterInput label="Exp (Yrs)" value={filters.experienceRequired} onChange={v => setFilters({ ...filters, experienceRequired: v })} type="number" placeholder="0" />

                        <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-md active:scale-95">
                            Apply Filters
                        </button>
                    </form>
                </aside>

                <button 
                    onClick={() => setShowFilters(true)} 
                    className="lg:hidden flex items-center justify-center gap-2 bg-white p-3.5 rounded-2xl border border-slate-200 font-bold text-slate-700 shadow-sm text-sm"
                >
                    <Filter size={18} /> Refine Search
                </button>

                {/* Job Listing Area */}
                <main className="lg:w-3/4 w-full space-y-3">
                    <div className="flex justify-between items-center mb-1 px-1">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Found {jobs?.length || 0} Openings
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-blue-600"></div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Searching...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        jobs.map((job) => <JobCard key={job.jobId} job={job} />)
                    ) : (
                        <div className="bg-white p-16 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                            <Search className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-slate-900">No vacancies matched</h3>
                            <p className="text-slate-400 font-medium mt-1 text-sm">Adjust your filters and try again.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const JobCard = ({ job }) => {
    const navigate = useNavigate();
    const isPaused = job.status === 'PAUSED';
    const isOpen = job.status === 'OPEN';

    return (
        <div
            onClick={() => navigate(`/jobs/${job.jobId}`)}
            /* Reduced padding from p-7 to p-5 */
            className="group bg-white p-5 rounded-[2rem] border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1">
                        {/* Reduced title from text-2xl to text-lg */}
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                            {job.title}
                        </h3>
                        {!isOpen && (
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                isPaused ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                                {job.status}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100">
                            {job.category}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold ml-1">
                            <Clock size={12}/> Recent
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-tight">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors"><MapPin size={14} /></div>
                            {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors"><Briefcase size={14} /></div>
                            {job.type?.replace('_', ' ')}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors"><DollarSign size={14} /></div>
                            ₹{job.salaryMin} - {job.salaryMax}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto self-center">
                    {isOpen ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/jobs/${job.jobId}`);
                            }}
                            /* Reduced button padding from px-8 py-4 to px-6 py-3 */
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95"
                        >
                            Apply Now <ChevronRight size={14} />
                        </button>
                    ) : (
                        <div className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-dashed ${
                            isPaused ? 'border-amber-200 text-amber-500 bg-amber-50/30' : 'border-rose-200 text-rose-500 bg-rose-50/30'
                        }`}>
                            {isPaused ? 'Paused' : 'Closed'}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-50 flex flex-wrap gap-1.5">
                {job.skills?.slice(0, 5).map((skill, i) => (
                    <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[8px] font-black rounded-lg uppercase tracking-tight border border-slate-50 group-hover:border-blue-100 group-hover:bg-blue-50/30 group-hover:text-blue-600 transition-all"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};

const FilterInput = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-1.5">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input
            type={type}
            className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition text-xs font-bold text-slate-700 placeholder:text-slate-300"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

export default BrowseJobs;