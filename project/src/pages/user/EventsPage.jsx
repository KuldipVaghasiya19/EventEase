import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/apiClient';
import { Calendar, MapPin, Ticket, Search, Filter, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
      <p className="text-indigo-900 font-bold uppercase tracking-widest text-xs">Syncing Database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header with Search */}
      <div className="bg-slate-900 pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tight">
            Explore <span className="text-indigo-500">Live</span> Events
          </h1>
          <div className="max-w-2xl mx-auto relative mt-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
            <input 
              type="text"
              placeholder="Search by event name, venue, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-none pl-16 pr-8 py-5 rounded-2xl shadow-2xl focus:ring-4 focus:ring-indigo-600/20 outline-none font-bold text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-lg w-fit">
           <Filter className="h-4 w-4 text-indigo-600" />
           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Showing {filteredEvents.length} results</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-[3rem] py-32 text-center shadow-xl border border-slate-100">
             <Calendar className="h-16 w-16 text-slate-200 mx-auto mb-4" />
             <h3 className="text-2xl font-black text-slate-900">No events found matching your search.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.map((event) => (
              <div key={event.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:border-indigo-200 transition-all">
                <div className="h-56 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                   <div className="absolute inset-0 bg-indigo-600 opacity-10 group-hover:opacity-20 transition-opacity" />
                   <Calendar className="h-20 w-20 text-indigo-600 opacity-20" />
                   <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                      {event.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                   </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                    {event.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">
                    {event.about}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                      <MapPin className="h-4 w-4 text-indigo-600" /> {event.venue}
                    </div>
                    <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-3">
                        <Ticket className="h-4 w-4 text-indigo-600" /> {event.totalSeats - event.bookedSeats} Left
                      </div>
                      <div className="text-indigo-600">{event.bookedSeats}/{event.totalSeats}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(user ? `/events/${event.id}` : '/login-selection')}
                    className="mt-auto w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group"
                  >
                    {user ? 'RESERVE NOW' : 'SIGN IN TO BOOK'} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;