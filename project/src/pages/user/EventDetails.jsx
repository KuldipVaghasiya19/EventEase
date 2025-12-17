import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import { useAuth } from '../../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await apiClient.get(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login-selection');
      return;
    }

    setBookingLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Endpoint matches the BookingController below
      const response = await apiClient.post(`/bookings/reserve/${id}`, {
        seats: 1 // Sending 1 seat by default
      });

      setMessage({ type: 'success', text: 'Ticket Booked Successfully! View it in your dashboard.' });
      // Refresh event data to show updated seat count
      fetchEventDetails();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data || "Booking failed. Seats might be full." 
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-40 text-center font-black text-indigo-600 animate-pulse">LOADING EVENT...</div>;
  if (!event) return <div className="min-h-screen pt-40 text-center font-black text-red-500">EVENT NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase mb-8 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 grid lg:grid-cols-2">
          {/* Left: Event Visual */}
          <div className="bg-indigo-600 p-12 flex flex-col justify-center items-center text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Ticket className="h-40 w-40" /></div>
            <Calendar className="h-24 w-24 mb-6" />
            <h1 className="text-4xl font-black uppercase tracking-tighter text-center">{event.name}</h1>
            <p className="mt-4 font-bold text-indigo-100">{event.organizationName}</p>
          </div>

          {/* Right: Booking Actions */}
          <div className="p-12">
            <div className="mb-8">
              <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">About Event</h2>
              <p className="text-slate-600 font-medium leading-relaxed">{event.about}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <MapPin className="h-5 w-5 text-indigo-600 mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase">Venue</p>
                <p className="text-sm font-black text-slate-900">{event.venue}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <Users className="h-5 w-5 text-indigo-600 mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase">Availability</p>
                <p className="text-sm font-black text-slate-900">{event.totalSeats - event.bookedSeats} / {event.totalSeats}</p>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : null}
                {message.text}
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={bookingLoading || event.bookedSeats >= event.totalSeats}
              className={`w-full py-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-xl
                ${event.bookedSeats >= event.totalSeats 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
            >
              {bookingLoading ? 'Processing...' : event.bookedSeats >= event.totalSeats ? 'Event Full' : 'Confirm Reservation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;