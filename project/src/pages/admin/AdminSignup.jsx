import React, { useState } from 'react';
import apiClient from '../../utils/apiClient';
import { useNavigate, Link } from 'react-router-dom';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'SYSTEM', 
    location: '',
    since: new Date().getFullYear(), // Default to current year
    contact: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // AdminType enum options from Admin.java
  const adminTypes = ['SYSTEM', 'SUPERVISOR', 'EVENT_MANAGER', 'OTHER'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // POST /api/auth/register/admin
      await apiClient.post('/auth/register/admin', formData);
      
      alert('Admin registration successful! Please log in.');
      navigate('/login/admin');

    } catch (err) {
      console.error('Registration failed:', err.response || err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white p-10 rounded-2xl shadow-2xl space-y-8">
        <h2 className="text-center text-4xl font-extrabold text-primary-700 border-b pb-4">
          Admin Account Registration
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={labelClass}>Organization Name</label>
                <input name="name" type="text" required placeholder="Acme Events" value={formData.name} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <input name="email" type="email" required placeholder="admin@example.com" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <input name="password" type="password" required placeholder="********" value={formData.password} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="type" className={labelClass}>Admin Type</label>
                <select name="type" required value={formData.type} onChange={handleChange} className={inputClass}>
                  {adminTypes.map(type => (<option key={type} value={type}>{type.replace('_', ' ')}</option>))}
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className={labelClass}>Location</label>
                <input name="location" type="text" required placeholder="City, Country" value={formData.location} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="since" className={labelClass}>Established Year (Since)</label>
                <input name="since" type="number" required placeholder="2024" value={formData.since} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="contact" className={labelClass}>Contact Number</label>
                <input name="contact" type="text" placeholder="+91-653-555-1234" value={formData.contact} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

        <button type="submit" disabled={loading} className="w-full py-3 px-4 text-lg font-semibold rounded-lg text-white bg-primary-700 hover:bg-primary-800 disabled:bg-primary-500 transition duration-150">            {loading ? 'Processing...' : 'Create Admin Account'}
          </button>
        </form>
        
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already registered?{' '}
            <Link to="/login/admin" className="font-medium text-primary-700 hover:text-indigo-800">Log in</Link>
          </p>
          <p className="mt-2 text-gray-600">
            Switch to{' '}
            <Link to="/signup/user" className="font-medium text-primary-700 hover:text-indigo-800">User Registration</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;