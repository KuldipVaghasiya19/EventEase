import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Ticket, 
  LogOut, 
  Mail, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  QrCode, 
  XCircle, 
  Search,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/apiClient';

const UserDashboard = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  // 1. Authorization and Data Fetching
  useEffect(() => {
    if (user && userRole === 'USER') {
      fetchMyData();
    } else if (user && userRole === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else if (!user && !loading) {
      navigate('/login-selection');
    }
  }, [user, userRole]);

  const fetchMyData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/bookings/user/mybookings');
      setMyBookings(response.data);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Cancellation Logic
  const handleCancel = async (bookingId) => {
  if (!bookingId) {
    alert("Error: Invalid Booking ID");
    return;
  }

  const confirmCancel = window.confirm("Are you sure you want to cancel this ticket?");
  if (!confirmCancel) return;

  try {
    // Log the ID to console to verify it is a real number before sending
    console.log("Attempting to cancel Booking ID:", bookingId);
    
    await apiClient.delete(`/bookings/cancel/${bookingId}`);
    fetchMyData(); // Refresh the list
  } catch (error) {
    console.error('Cancellation error details:', error.response);
    alert(error.response?.data || "Failed to cancel ticket.");
  }
};
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
      <p className="text-indigo-900 font-black text-xs tracking-widest uppercase">Fetching your passes...</p>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      
      {/* PREMIUM USER HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10 w-28 h-28 bg-indigo-600 rounded-3xl flex items-center justify-center text-5xl font-black shadow-xl shadow-indigo-500/20">
            {user?.name?.charAt(0)}
          </div>

          <div className="relative z-10 flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
              {user?.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-5 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400" /> {user?.email}
              </span>
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-400" /> Participant Portal
              </span>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="relative z-10 bg-white/10 hover:bg-red-500 hover:text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <Ticket className="text-indigo-600 h-6 w-6" /> My Digital Passes
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage your active reservations and event access.</p>
          </div>
          <Link 
            to="/events" 
            className="flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-100 px-6 py-3 rounded-xl font-black text-xs tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            <Search className="h-4 w-4" /> EXPLORE EVENTS
          </Link>
        </div>

        {myBookings.length === 0 ? (
          <div className="bg-white rounded-[3rem] py-32 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase">No active bookings</h3>
            <p className="text-slate-500 font-medium mt-2 mb-8">Ready for your next adventure? Find an event today.</p>
            <Link to="/events" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-indigo-600 transition-all">
              BROWSE EVENTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {myBookings.map((booking) => (
              <div key={booking.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 flex transition-all hover:border-indigo-200">
                
                {/* Visual Accent Strip */}
                <div className="w-3 bg-indigo-600 h-auto group-hover:w-5 transition-all opacity-20" />
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit">
                        Confirmed Entry
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Booking Ref: #{booking.id.toString().padStart(6, '0')}
                      </span>
                    </div>
                    
                    {/* CANCEL BUTTON */}
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-red-500 transition-colors uppercase tracking-widest group/btn"
                    >
                      <XCircle className="h-4 w-4 group-hover/btn:scale-110 transition-transform" /> 
                      Cancel Ticket
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                    {booking.event.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg"><Calendar className="h-4 w-4 text-indigo-500" /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Date</p>
                        <p className="text-xs font-black text-slate-700">
                          {new Date(booking.event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg"><MapPin className="h-4 w-4 text-indigo-500" /></div>
                      <div className="truncate">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Venue</p>
                        <p className="text-xs font-black text-slate-700 truncate">{booking.event.venue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-dashed border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <QrCode className="h-8 w-8 text-slate-300" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase leading-tight">Entrance<br/>Pass</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Seats</p>
                       <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-full font-black text-lg">
                          {booking.seatsBooked}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;