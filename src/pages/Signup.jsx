import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, setRole } from '../redux/authSlice'; // Import setRole action
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'CANDIDATE' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser(formData));
    if (signupUser.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  const handleSocialSignup = (provider) => {
    navigate(`/select-role?provider=${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join thousands of professionals today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${
                formData.role === 'CANDIDATE' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-tighter">Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${
                formData.role === 'RECRUITER' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-tighter">Recruiter</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
                placeholder="Email Address"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
                placeholder="Create Password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-2"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <span className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></span>
          <span className="relative bg-white px-4 text-xs text-slate-400 font-bold uppercase tracking-widest">Or Sign Up with</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleSocialSignup('google')}
            className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-semibold text-slate-700 text-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
            Google
          </button>
          {/* <button 
            onClick={() => handleSocialSignup('github')}
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-semibold text-sm"
          >
            <Github className="w-4 h-4" />
            GitHub
          </button> */}
        </div>

        <p className="text-center text-slate-600 mt-8 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;