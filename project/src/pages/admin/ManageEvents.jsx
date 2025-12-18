import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/apiClient';
import { Calendar, ArrowLeft, CheckCircle } from 'lucide-react';

const ManageEvents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    about: '',
    organizationName: '',
    venue: '',
    date: '',
    totalSeats: '',
    tags: ''
  });

  useEffect(() => {
    if (id) fetchEventToEdit();
  }, [id]);

  const fetchEventToEdit = async () => {
    setFetching(true);
    try {
      const response = await apiClient.get(`/events/${id}`);
      const event = response.data;
      setFormData({
        name: event.name,
        about: event.about,
        organizationName: event.organizationName,
        venue: event.venue,
        date: event.date ? event.date.substring(0, 16) : '',
        totalSeats: event.totalSeats.toString(),
        tags: event.tags ? Array.from(event.tags).join(', ') : ''
      });
    } catch (err) {
      setError("Failed to load event data.");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    
    // FIX: Append ":00" to the date string if seconds are missing
    const formattedDate = formData.date.length === 16 
      ? `${formData.date}:00` 
      : formData.date;

    const payload = {
      ...formData,
      date: formattedDate, // Use the fixed date string
      totalSeats: parseInt(formData.totalSeats),
      tags: tagsArray,
      status: "UPCOMING"
    };

    try {
      if (id) {
        await apiClient.put(`/events/admin/${id}`, payload);
      } else {
        await apiClient.post('/events/admin', payload);
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      // Extracting string from error object to prevent the React crash you saw earlier
      const rawError = err.response?.data;
      const message = rawError?.message || (typeof rawError === 'string' ? rawError : "Operation failed.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-8 hover:text-indigo-600 transition-all">
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
          {/* CENTERED BIG HEADING */}
          <div className="text-center py-12 border-b border-slate-50">
            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tight">
              {id ? 'Update' : 'Create'} <span className="text-indigo-600">Event</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">EventEase Management Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-8">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-tight border border-red-100 text-center">{error}</div>}
            {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-tight border border-emerald-100 text-center flex items-center justify-center gap-2"><CheckCircle size={16}/> Success! Redirecting...</div>}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Event Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Organization</label>
                <input name="organizationName" value={formData.organizationName} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Venue</label>
                <input name="venue" value={formData.venue} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Total Seats</label>
                <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Date & Time</label>
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tags (Comma separated)</label>
                <input name="tags" value={formData.tags} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" placeholder="Tech, Music" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">About Event</label>
              <textarea name="about" value={formData.about} onChange={handleChange} required rows="4" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900 resize-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              {loading ? 'Processing...' : id ? 'Update Event Details' : 'Publish Live Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;