import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { submitApplication } from '../redux/applicationSlice';
import { fetchJobById } from '../redux/jobSlice';
import { FileText, Link as LinkIcon, Send, AlertCircle } from 'lucide-react';

const ApplyJob = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { selectedJob: job } = useSelector(state => state.jobs);
  
  const [formData, setFormData] = useState({ coverLetter: '', resumeUrl: '' });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CANDIDATE') {
      navigate(`/jobs/${id}`);
    }
    dispatch(fetchJobById(id));
  }, [id, isAuthenticated, user, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(submitApplication({ jobId: id, ...formData }));
    if (submitApplication.fulfilled.match(result)) {
      alert("Application submitted successfully!");
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Apply for {job?.title}</h1>
          <p className="text-slate-500">Submit your application to {job?.category}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <LinkIcon size={16} /> Resume URL
            </label>
            <input 
              type="url" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://drive.google.com/your-resume"
              onChange={e => setFormData({...formData, resumeUrl: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileText size={16} /> Cover Letter
            </label>
            <textarea 
              required rows="6" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell the recruiter why you are a good fit..."
              onChange={e => setFormData({...formData, coverLetter: e.target.value})}
            ></textarea>
          </div>

          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <Send size={18} /> Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;