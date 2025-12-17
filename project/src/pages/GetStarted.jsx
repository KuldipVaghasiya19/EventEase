import React, { useState } from 'react';
import { User, ShieldCheck } from 'lucide-react';
import UserSignup from './user/UserSignup';
import AdminSignup from './admin/AdminSignup';

const GetStarted = () => {
  const [activeTab, setActiveTab] = useState('user');

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">
            Join <span className="text-indigo-600">EventEase</span> Today
          </h1>
          <p className="text-slate-500 font-medium">
            Select your account type to begin your journey with us.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-full max-w-md mx-auto mb-10 border border-slate-200">
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black text-xs tracking-widest transition-all
              ${activeTab === 'user' 
                ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User className="h-4 w-4" />
            PARTICIPANT
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black text-xs tracking-widest transition-all
              ${activeTab === 'admin' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ShieldCheck className="h-4 w-4" />
            ADMINISTRATOR
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          <div className="p-2 bg-slate-50 border-b border-slate-100 text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Registration Portal — {activeTab === 'user' ? 'Participant Access' : 'Organization Access'}
            </span>
          </div>
          
          <div className="p-8 md:p-12">
            {activeTab === 'user' ? <UserSignup /> : <AdminSignup />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;