import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../redux/profileSlice';

const CompleteProfile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: { houseNo: '', street: '', city: '', state: '', pincode: '' },
    // Candidate specific
    dob: '', gender: '', skills: '', experience: '', resumeUrl: '',
    // Recruiter specific
    companyName: '', companySize: '', industry: '', website: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Format skills for candidate if needed
    const submissionData = { ...formData };
    if (user.role === 'CANDIDATE') {
      submissionData.skills = formData.skills.split(',').map(s => s.trim());
    }

    const result = await dispatch(createProfile({ role: user.role, profileData: submissionData }));
    if (createProfile.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
        <h1 className="text-2xl font-bold mb-6">Complete Your {user?.role} Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" required className="input-style" 
              onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input type="number" placeholder="Mobile Number" required className="input-style"
              onChange={e => setFormData({...formData, mobile: e.target.value})} />
          </div>

          <h3 className="font-semibold border-b pb-2">Address Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input type="text" placeholder="House No" className="input-style" onChange={e => setFormData({...formData, address: {...formData.address, houseNo: e.target.value}})} />
            <input type="text" placeholder="Street" className="input-style" onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value}})} />
            <input type="text" placeholder="City" className="input-style" onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})} />
            <input type="text" placeholder="State" className="input-style" onChange={e => setFormData({...formData, address: {...formData.address, state: e.target.value}})} />
            <input type="number" placeholder="Pincode" className="input-style" onChange={e => setFormData({...formData, address: {...formData.address, pincode: e.target.value}})} />
          </div>

          {user?.role === 'CANDIDATE' ? (
            <>
              <h3 className="font-semibold border-b pb-2">Professional Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="date" className="input-style" onChange={e => setFormData({...formData, dob: e.target.value})} />
                <select className="input-style" onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input type="text" placeholder="Skills (comma separated)" className="input-style" onChange={e => setFormData({...formData, skills: e.target.value})} />
                <input type="number" placeholder="Years of Experience" className="input-style" onChange={e => setFormData({...formData, experience: e.target.value})} />
                <input type="text" placeholder="Resume URL" className="input-style col-span-full" onChange={e => setFormData({...formData, resumeUrl: e.target.value})} />
              </div>
            </>
          ) : (
            <>
              <h3 className="font-semibold border-b pb-2">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Company Name" className="input-style" onChange={e => setFormData({...formData, companyName: e.target.value})} />
                <input type="text" placeholder="Industry" className="input-style" onChange={e => setFormData({...formData, industry: e.target.value})} />
                <input type="text" placeholder="Company Size" className="input-style" onChange={e => setFormData({...formData, companySize: e.target.value})} />
                <input type="text" placeholder="Website URL" className="input-style" onChange={e => setFormData({...formData, website: e.target.value})} />
              </div>
            </>
          )}

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;