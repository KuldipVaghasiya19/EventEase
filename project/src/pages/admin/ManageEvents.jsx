import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/apiClient';
import { Calendar, MapPin, Users, Building, Tag, ArrowLeft, CheckCircle, Edit3 } from 'lucide-react';

const ManageEvents = () => {
  const { id } = useParams(); // Detects if we are editing (e.g., /admin/manage-events/5)
  const { user } = useAuth();
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

  // 1. If an ID exists, fetch existing data to populate the form
  useEffect(() => {
    if (id) {
      fetchEventToEdit();
    }
  }, [id]);

  const fetchEventToEdit = async () => {
    setFetching(true);
    try {
      const response = await apiClient.get(`/events/${id}`);
      const event = response.data;
      
      // Map backend data to form fields
      setFormData({
        name: event.name,
        about: event.about,
        organizationName: event.organizationName,
        venue: event.venue,
        // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
        date: event.date ? event.date.substring(0, 16) : '',
        totalSeats: event.totalSeats.toString(),
        tags: event.tags ? Array.from(event.tags).join(', ') : ''
      });
    } catch (err) {
      setError("Failed to load event data for editing.");
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
    const payload = {
      ...formData,
      totalSeats: parseInt(formData.totalSeats),
      tags: tagsArray,
      status: "UPCOMING"
    };

    try {
      if (id) {
        // UPDATE LOGIC: Use PUT for existing event
        await apiClient.put(`/events/admin/${id}`, payload);
      } else {
        // CREATE LOGIC: Use POST for new event
        await apiClient.post('/events/admin', payload);
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data || "Operation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase mb-8 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-8 text-center border-b border-slate-800">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              {id ? 'Update Event' : 'Create New Event'}
            </h1>
            <p className="text-indigo-400 text-xs font-bold mt-2 tracking-widest uppercase">
              {id ? `Editing Event ID: ${id}` : 'EventEase Organization Portal'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 text-center">{error}</div>}
            {success && <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100 text-center flex items-center justify-center gap-2"><CheckCircle className="h-4 w-4"/> {id ? 'Event Updated!' : 'Event Created!'} Redirecting...</div>}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" placeholder="Event Name" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization</label>
                <input name="organizationName" value={formData.organizationName} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" placeholder="Organization" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Venue</label>
                <input name="venue" value={formData.venue} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" placeholder="Venue" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" placeholder="Total Seats" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date & Time</label>
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tags (Comma separated)</label>
                <input name="tags" value={formData.tags} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900" placeholder="Tag1, Tag2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea name="about" value={formData.about} onChange={handleChange} required rows="4" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-900 resize-none" placeholder="Description..." />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              {loading ? 'Processing...' : id ? 'Update Live Event' : 'Publish Live Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;