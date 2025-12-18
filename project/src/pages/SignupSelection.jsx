import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';

const SignupSelection = () => {
  const navigate = useNavigate();

  const selectionCards = [
    {
      title: "User",
      description: "Create an account to explore upcoming events, book seats, and manage your personal tickets.",
      icon: User,
      path: "/signup/user", // Points to your UserSignup.jsx route
      color: "indigo"
    },
    {
      title: "Administrator",
      description: "Register your organization to start hosting events, managing registrations, and generating reports.",
      icon: ShieldCheck,
      path: "/signup/admin", // Points to your AdminSignup.jsx route
      color: "slate"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">
            Create <span className="text-indigo-600">Account</span>
          </h1>
          <p className="text-slate-500 font-medium italic">
            Select your account type to begin your journey with EventEase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {selectionCards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.path)}
              className="group relative bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 text-left transition-all hover:-translate-y-2 hover:border-indigo-200"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all
                ${card.color === 'indigo' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-900 text-white shadow-xl shadow-slate-300'}`}>
                <card.icon className="h-8 w-8" />
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">
                {card.title}
              </h2>
              
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                {card.description}
              </p>
              
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xs tracking-widest uppercase">
                Start Registration <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            Already have an account? <span onClick={() => navigate('/login-selection')} className="text-indigo-600 cursor-pointer hover:underline ml-2">Log in here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupSelection;