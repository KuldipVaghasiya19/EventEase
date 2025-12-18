import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Plus, Calendar, Users, Mail, Search, 
  Edit3, UserCheck, FileText, ChevronDown, Trash2, MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/apiClient';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [regSearch, setRegSearch] = useState('');
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Professional Date Formatter for UI and PDF
  const formatDate = (dateInput) => {
    if (!dateInput) return "No Date Set";
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return "Invalid Date";
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (error) {
      return "Format Error";
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchDashboardData();
    } else {
      navigate('/login-selection');
    }
  }, [user, activeTab, selectedEventId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const eventRes = await apiClient.get('/events');
      setEvents(eventRes.data);

      if (activeTab === 'users') {
        const url = selectedEventId === 'all' 
          ? '/bookings/admin/registrations' 
          : `/bookings/admin/registrations?eventId=${selectedEventId}`;
        const regRes = await apiClient.get(url);
        setRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure? This will delete the event and all associated registrations permanently.")) return;
    try {
      await apiClient.delete(`/events/admin/${eventId}`);
      fetchDashboardData();
    } catch (error) {
      alert("Error deleting event: " + (error.response?.data || "Server error"));
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const eventName = selectedEventId === 'all' 
        ? 'All Managed Events' 
        : events.find(e => e.id.toString() === selectedEventId.toString())?.name;
      
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229);
      doc.text("EventEase Registration Report", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Event Source: ${eventName}`, 14, 30);
      doc.text(`Generated: ${formatDate(new Date())}`, 14, 36);

      const tableColumn = ["Booking ID", "Participant", "Email", "Event", "Booking Time"];
      const tableRows = registrations.map(reg => [
        `#B-${reg.id}`,
        reg.user?.name || 'N/A',
        reg.user?.email || 'N/A',
        reg.event?.name || 'N/A',
        formatDate(reg.bookingTime)
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 }
      });

      doc.save(`Registrations_${eventName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.user?.name.toLowerCase().includes(regSearch.toLowerCase()) || 
    reg.user?.email.toLowerCase().includes(regSearch.toLowerCase()) ||
    reg.event?.name.toLowerCase().includes(regSearch.toLowerCase())
  );

  if (loading && events.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50 font-sans">
      {/* ADMIN HEADER */}
      <div className="bg-slate-900 py-16 px-6 text-white text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight">Admin Dashboard</h1>
        <p className="text-indigo-400 font-bold text-xs mt-2 tracking-widest uppercase tracking-[0.3em]">Management Portal</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          
          {/* NAVIGATION BAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-50 border-b">
            <nav className="flex p-1 gap-2 bg-slate-200/50 rounded-2xl">
              <button 
                onClick={() => setActiveTab('events')} 
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Calendar className="inline h-3 w-3 mr-2" /> My Events
              </button>
              <button 
                onClick={() => setActiveTab('users')} 
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                <UserCheck className="inline h-3 w-3 mr-2" /> Registrations
              </button>
            </nav>
            <Link to="/admin/manage-events" className="mt-4 lg:mt-0 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs tracking-widest hover:bg-indigo-700 shadow-xl transition-all shadow-indigo-100">
              + CREATE NEW EVENT
            </Link>
          </div>

          <div className="p-8">
            {/* MY EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div key={event.id} className="border border-slate-100 rounded-[2rem] p-8 bg-white shadow-sm flex flex-col group hover:border-indigo-100 transition-all">
                    <h4 className="text-xl font-black text-slate-900 mb-2 truncate uppercase">{event.name}</h4>
                    <p className="text-[10px] font-black text-indigo-500 mb-4 tracking-widest uppercase">📅 {formatDate(event.date)}</p>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-8 font-medium leading-relaxed">{event.about}</p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendance</span>
                        <span className="text-sm font-black text-indigo-600">{event.bookedSeats} / {event.totalSeats}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/admin/manage-events/${event.id}`} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><Edit3 className="h-4 w-4" /></Link>
                        <button onClick={() => handleDeleteEvent(event.id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* REGISTRATIONS TAB */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                  {/* Event Dropdown Filter */}
                  <div className="flex-1 w-full lg:max-w-xs">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Event Filter</label>
                    <div className="relative">
                      <select 
                        value={selectedEventId} 
                        onChange={(e) => setSelectedEventId(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-bold text-sm outline-none appearance-none"
                      >
                        <option value="all">All Managed Events</option>
                        {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="flex-1 w-full lg:max-w-md">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Search Attendees</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={regSearch} 
                        onChange={(e) => setRegSearch(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all" 
                      />
                    </div>
                  </div>

                  {/* Export PDF */}
                  <button 
                    onClick={downloadPDF} 
                    disabled={registrations.length === 0} 
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                  >
                    <FileText className="h-4 w-4" /> Export PDF Report
                  </button>
                </div>

                {/* REGISTRATIONS TABLE */}
                <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-5 pl-8">Booking ID</th>
                        <th className="py-5">Participant</th>
                        <th className="py-5">Event</th>
                        <th className="py-5">Booking Time</th>
                        <th className="py-5 text-right pr-8">Seats</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-20 text-center text-slate-400 italic font-medium">
                            No registrations found matching your selection.
                          </td>
                        </tr>
                      ) : (
                        filteredRegistrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="py-6 pl-8 font-black text-indigo-600 text-xs uppercase tracking-tighter">
                              #B-{reg.id}
                            </td>
                            <td className="py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs uppercase">
                                  {reg.user?.name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{reg.user?.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 lowercase">{reg.user?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="text-xs font-black text-slate-600 uppercase tracking-tighter">
                              {reg.event?.name}
                            </td>
                            <td className="text-[11px] font-bold text-slate-400">
                              {formatDate(reg.bookingTime)}
                            </td>
                            <td className="text-right pr-8">
                              <span className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg font-black text-xs">{reg.seatsBooked}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">EventEase Administration &copy; 2025</p>
      </div>
    </div>
  );
};

export default AdminDashboard;