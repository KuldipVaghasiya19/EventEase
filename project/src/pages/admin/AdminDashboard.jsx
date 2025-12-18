import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Plus, Calendar, Users, Mail, Search, 
  Edit3, UserCheck, FileText, ChevronDown, Trash2, MapPin,
  ShieldCheck, LogOut
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

  const formatDate = (dateInput) => {
    if (!dateInput) return "No Date Set";
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return "Invalid Date";
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).format(date);
    } catch (error) { return "Format Error"; }
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
      const eventRes = await apiClient.get('/events/admin/my-events');
      setEvents(eventRes.data);

      if (activeTab === 'users') {
        const url = selectedEventId === 'all' 
          ? '/bookings/admin/registrations' 
          : `/bookings/admin/registrations?eventId=${selectedEventId}`;
        const regRes = await apiClient.get(url);
        setRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
      }
    } catch (e) { 
      console.error("Fetch error:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure? This will delete the event permanently.")) return;
    try {
      await apiClient.delete(`/events/admin/${eventId}`);
      fetchDashboardData();
    } catch (error) {
      alert("Error deleting event");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // FIXED PDF LOGIC
  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Safety check for event name
      const eventObj = events.find(e => e.id.toString() === selectedEventId.toString());
      const eventName = selectedEventId === 'all' ? 'All Managed Events' : (eventObj?.name || 'Unknown Event');
      
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229); // Indigo-600
      doc.text("EventEase Registration Report", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Organizer: ${user?.name || 'Admin'}`, 14, 30);
      doc.text(`Event: ${eventName}`, 14, 36);
      doc.text(`Generated: ${formatDate(new Date())}`, 14, 42);

      const tableColumn = ["Ref ID", "Participant", "Email", "Event", "Time"];
      
      // Filter current table view data for PDF
      const rowsForPdf = filteredRegistrations.map(reg => [
        `#B-${reg.id}`,
        reg.user?.name || 'N/A',
        reg.user?.email || 'N/A',
        reg.event?.name || 'N/A',
        formatDate(reg.bookingTime)
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: rowsForPdf,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 }
      });

      doc.save(`Registrations_${eventName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Could not generate PDF. Please try again.");
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.user?.name?.toLowerCase().includes(regSearch.toLowerCase()) || 
    reg.user?.email?.toLowerCase().includes(regSearch.toLowerCase())
  );

  if (loading && events.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
      <p className="text-indigo-900 font-black text-xs tracking-widest uppercase tracking-tight">Portal Syncing...</p>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      
      {/* PREMIUM ADMIN HEADER - Matches UserDashboard Exactly */}
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
                <ShieldCheck className="h-4 w-4 text-indigo-400" /> Administrator Portal
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

      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-50 border-b">
            <nav className="flex p-1 gap-2 bg-slate-200/50 rounded-2xl">
              <button 
                onClick={() => setActiveTab('events')} 
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Calendar className="inline h-3 w-3 mr-2" /> My Events
              </button>
              <button 
                onClick={() => setActiveTab('users')} 
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500'}`}
              >
                <UserCheck className="inline h-3 w-3 mr-2" /> Registrations
              </button>
            </nav>
            <Link to="/admin/manage-events" className="mt-4 lg:mt-0 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs tracking-widest hover:bg-indigo-600 shadow-xl transition-all shadow-slate-200">
              + CREATE NEW EVENT
            </Link>
          </div>

          <div className="p-8">
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div key={event.id} className="border border-slate-100 rounded-[2rem] p-8 bg-white shadow-sm flex flex-col group hover:border-indigo-200 transition-all">
                    <h4 className="text-xl font-black text-slate-900 mb-2 truncate uppercase group-hover:text-indigo-600 transition-colors">{event.name}</h4>
                    <p className="text-[10px] font-black text-indigo-500 mb-4 tracking-widest uppercase">📅 {formatDate(event.date)}</p>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-8 font-medium leading-relaxed italic">"{event.about}"</p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Capacity</span>
                        <span className="text-sm font-black text-indigo-600">{event.totalSeats} Slots</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/admin/manage-events/${event.id}`} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Edit3 className="h-4 w-4" /></Link>
                        <button onClick={() => handleDeleteEvent(event.id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 items-end">
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

                  <div className="flex-1 w-full lg:max-w-md">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Search Attendees</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="SEARCH BY NAME OR EMAIL..." 
                        value={regSearch} 
                        onChange={(e) => setRegSearch(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-xl font-black text-[10px] uppercase outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={downloadPDF}
                    disabled={filteredRegistrations.length === 0}
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg disabled:opacity-50"
                  >
                    <FileText className="h-4 w-4" /> Export Report
                  </button>
                </div>

                <div className="overflow-x-auto rounded-[2rem] border border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-5 pl-8">Ref ID</th>
                        <th className="py-5">Participant</th>
                        <th className="py-5">Event</th>
                        <th className="py-5 pr-8">Booking Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="py-6 pl-8 font-black text-indigo-600 text-xs">#B-{reg.id}</td>
                          <td className="py-6">
                            <p className="text-sm font-black text-slate-900 uppercase leading-none mb-1">{reg.user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 lowercase">{reg.user?.email}</p>
                          </td>
                          <td className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{reg.event?.name}</td>
                          <td className="py-6 pr-8 text-[11px] font-bold text-slate-400">
                            {formatDate(reg.bookingTime)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;