import React from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setRole } from '../redux/authSlice';
import { User, Briefcase } from 'lucide-react';

const RoleSelection = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get('provider');

  const selectRoleAndRedirect = (role) => {
    dispatch(setRole(role));
    // Redirect to backend OAuth endpoint
    window.location.href = `http://localhost:8080/api/auth/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Join as...</h2>
        <p className="text-slate-500 mb-8">Please select your account type to continue with {provider}</p>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => selectRoleAndRedirect('CANDIDATE')}
            className="group p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-left"
          >
            <User className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold text-lg">Candidate</h3>
            <p className="text-sm text-slate-500">I am looking for a job.</p>
          </button>

          <button 
            onClick={() => selectRoleAndRedirect('RECRUITER')}
            className="group p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-left"
          >
            <Briefcase className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold text-lg">Recruiter</h3>
            <p className="text-sm text-slate-500">I want to hire talent.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;