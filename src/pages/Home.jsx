import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Search, Users, ArrowRight, Building2, 
  Zap, Globe, ShieldCheck, Sparkles 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-blue-50/50 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-slate-200">
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">The Future of Talent Acquisition</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95]">
            Hiring. <span className="text-blue-600">Evolved.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            The intelligent platform connecting the world's most ambitious 
            companies with elite professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95"
                >
                  Create Account
                </button>
                <button 
                  onClick={() => navigate('/jobs')}
                  className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Search size={16} /> Explore Jobs
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-3"
              >
                Go to Workspace <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. STATS BAR - Clean and Integrated */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-10 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
          <StatItem value="12k+" label="Live Positions" />
          <StatItem value="500+" label="Global Partners" />
          <StatItem value="98%" label="Placement Rate" />
          <StatItem value="24h" label="Avg. Response" />
        </div>
      </section>

      {/* 3. PATHWAYS - High Contrast Light vs Dark */}
      <section className="max-w-6xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Candidate Pathway */}
          <div className="group bg-white p-12 rounded-[3.5rem] border border-slate-200 hover:border-blue-400 transition-all shadow-sm flex flex-col items-start">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Users size={28} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">I'm a Candidate</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Access exclusive roles from top-tier tech companies. Manage your 
              pipeline with a professional, automated dashboard.
            </p>
            <button onClick={() => navigate('/jobs')} className="flex items-center gap-3 text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
              Start Applying <ArrowRight size={18} />
            </button>
          </div>

          {/* Recruiter Pathway */}
          <div className="group bg-slate-900 p-12 rounded-[3.5rem] transition-all shadow-2xl flex flex-col items-start">
            <div className="w-14 h-14 bg-white/10 text-blue-400 rounded-2xl flex items-center justify-center mb-10">
              <Building2 size={28} />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 tracking-tight">I'm a Recruiter</h3>
            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
              Reach the world’s best talent. Post opportunities, track candidates, 
              and build your dream team with powerful analytics.
            </p>
            <button onClick={() => navigate('/post-job')} className="flex items-center gap-3 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:text-blue-400 transition-all">
              Post Opportunity <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>

      {/* 4. VALUES SECTION - Minimal Grid */}
      <section className="bg-slate-50 py-28 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <ValueCard icon={<Zap className="text-blue-600" />} title="Real-time Tracking" desc="Get notified the second your status changes." />
            <ValueCard icon={<Globe className="text-blue-600" />} title="Global Infrastructure" desc="Access roles from remote-first companies." />
            <ValueCard icon={<ShieldCheck className="text-blue-600" />} title="Verified Quality" desc="Strict vetting for both jobs and talent." />
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="py-32 px-4 text-center">
        <div className="max-w-4xl mx-auto bg-slate-900 p-16 md:p-24 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-none">Ready for the <br /> next level?</h2>
          <button 
            onClick={() => navigate('/signup')}
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl active:scale-95"
          >
            Get Started Now
          </button>
        </div>
      </section>

    </div>
  );
};

// HELPER COMPONENTS
const StatItem = ({ value, label }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <div className="flex flex-col items-start text-left group">
    <div className="mb-6 group-hover:scale-110 transition-transform">{icon}</div>
    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">{title}</h4>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

export default Home;