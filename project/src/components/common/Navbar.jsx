import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, LogOut, Calendar } from 'lucide-react';

const Navbar = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardLink = userRole === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-indigo-100 z-50 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
            <Calendar className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            Event<span className="text-indigo-600">Ease</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link 
            to="/events" 
            className={`text-sm font-black transition-colors tracking-widest ${isActive('/events') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            ALL EVENTS
          </Link>
          
          {user ? (
            <div className="flex items-center gap-6">
              <Link 
                to={dashboardLink} 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs tracking-widest transition-all
                  ${location.pathname.includes('dashboard') 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                DASHBOARD
              </Link>
              
              <div className="h-10 w-px bg-slate-200" />

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase mt-1 tracking-tighter">
                    {userRole === 'ADMIN' ? 'Administrator' : 'Participant'}
                  </p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* UPDATED: Now points to the selection page */}
              <Link to="/login-selection" className={`text-sm font-black tracking-widest transition-colors ${isActive('/login-selection') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'} px-4`}>
                LOGIN
              </Link>
              <Link 
                to="/get-started" 
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
              >
                GET STARTED
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;