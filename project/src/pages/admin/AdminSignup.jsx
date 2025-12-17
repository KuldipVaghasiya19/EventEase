import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'SYSTEM',
    location: '',
    since: new Date().getFullYear(),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Maps to backend @PostMapping("/api/auth/register/admin")
    const { data, error: signUpError } = await signUp({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      type: formData.type,
      location: formData.location,
      since: parseInt(formData.since)
    }, 'admin');

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data) {
      alert('Admin registration successful! Please log in.');
      navigate('/login/admin');
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition duration-150";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Admin Signup</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <p className="p-2 bg-red-100 text-red-700 rounded text-sm">{error}</p>}
          
          <div>
            <label className={labelClass}>Organization Name</label>
            <input name="name" type="text" required value={formData.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input name="location" type="text" required value={formData.location} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input name="password" type="password" required value={formData.password} onChange={handleChange} className={inputClass} />
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition">
            {loading ? 'Registering...' : 'Register Admin'}
          </button>
        </form>
        
        <div className="text-center text-sm text-gray-600">
          Already have an account? <Link to="/login/admin" className="text-primary-700 font-bold">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;