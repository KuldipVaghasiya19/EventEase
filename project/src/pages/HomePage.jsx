import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ShieldCheck, Users, Zap, Search } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
            <Zap size={14} /> Simplified Event Management
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6 max-w-3xl leading-tight">
            The professional way to <span className="text-indigo-600">manage and book</span> your next event.
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl leading-relaxed">
            A sober, efficient platform for organizers and attendees. No clutter, just seamless registration and event tracking for your organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary Action: Direct to Booking */}
            <Link 
              to="/events" 
              className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 flex items-center gap-2"
            >
              Explore Events <Search size={18} />
            </Link>
            
            {/* Secondary Action: Learn More (Scrolls to Features) */}
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-slate-600 border border-slate-200 px-10 py-4 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid (Target for Learn More) */}
      <section id="features" className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">Why choose EventEase?</h2>
            <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-start bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Seamless Scheduling</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Organize events with ease using our refined administrative tools designed for clarity and speed.
              </p>
            </div>
            
            <div className="flex flex-col items-start bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Secure Reservations</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                [cite_start]Avoid duplicates and ensure data integrity with our robust, single-booking verification system. [cite: 1]
              </p>
            </div>

            <div className="flex flex-col items-start bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-3">User Management</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                [cite_start]Keep track of your participants with detailed registration records and automated report generation. [cite: 1]
              </p>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default Home;