import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ShieldCheck, Zap, Globe, ArrowRight, Play } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 rounded-l-[100px] -z-10" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-indigo-100">
              <Zap className="h-4 w-4" /> The Future of Event Management
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              Manage Your <span className="text-indigo-600">Events</span> With Absolute Ease.
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
              From college fests to corporate summits, EventEase provides a high-performance platform for organizers and participants to connect seamlessly.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/get-started')}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all flex items-center gap-2"
              >
                GET STARTED <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => navigate('/events')}
                className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                BROWSE EVENTS
              </button>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square bg-indigo-600 rounded-[3rem] shadow-2xl shadow-indigo-200 flex items-center justify-center relative overflow-hidden group">
                <Calendar className="h-40 w-40 text-white/20 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <Play className="h-8 w-8 text-indigo-600 fill-indigo-600 ml-1" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: "500+", lab: "Events Hosted" },
              { val: "50k+", lab: "Active Users" },
              { val: "100+", lab: "Universities" },
              { val: "99%", lab: "Success Rate" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <h3 className="text-4xl font-black text-white mb-2">{stat.val}</h3>
                <p className="text-indigo-400 text-xs font-black uppercase tracking-widest">{stat.lab}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Built for <span className="text-indigo-600">Growth</span></h2>
            <div className="h-1.5 w-20 bg-indigo-600 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Global Reach", desc: "Connect with participants from all over the world with our cloud infrastructure." },
              { icon: ShieldCheck, title: "Secure Booking", desc: "State-of-the-art authentication ensuring your tickets and data are safe." },
              { icon: Zap, title: "Instant Updates", desc: "Real-time notifications for event changes and seat availability." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all">
                <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;