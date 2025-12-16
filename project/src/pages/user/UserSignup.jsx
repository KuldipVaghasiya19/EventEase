import React, { useState } from 'react';
import apiClient from '../../utils/apiClient';
import { useNavigate, Link } from 'react-router-dom';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    course: '',
    currentlyStudyingOrNot: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');


    const payload = {
      ...formData
    };

    try {
      // POST /api/auth/register/user
      await apiClient.post('/auth/register/user', payload);
      
      alert('User registration successful! Please log in.');
      navigate('/login/user');

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
          User Account Registration
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={labelClass}>Full Name</label>
                <input name="name" type="text" required placeholder="Jane Doe" value={formData.name} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <input name="email" type="email" required placeholder="user@example.com" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <input name="password" type="password" required placeholder="********" value={formData.password} onChange={handleChange} className={inputClass} />
              </div>
              <div className="flex items-center space-x-4 pt-2">
                <input id="studying" name="currentlyStudyingOrNot" type="checkbox" checked={formData.currentlyStudyingOrNot} onChange={handleChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label htmlFor="studying" className="text-sm font-medium text-gray-900">Currently Studying</label>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="university" className={labelClass}>University / Institution</label>
                <input name="university" type="text" required placeholder="State University of Tech" value={formData.university} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="course" className={labelClass}>Course / Major</label>
                <input name="course" type="text" required placeholder="Computer Science" value={formData.course} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

        <button type="submit" disabled={loading} className="w-full py-3 px-4 text-lg font-semibold rounded-lg text-white bg-primary-700 hover:bg-primary-800 disabled:bg-primary-500 transition duration-150">            {loading ? 'Processing...' : 'Create User Account'}
          </button>
        </form>
        
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already registered?{' '}
            <Link to="/login/user" className="font-medium text-primary-700 hover:text-indigo-800">Log in</Link>
          </p>
          <p className="mt-2 text-gray-600">
            Switch to{' '}
            <Link to="/signup/admin" className="font-medium text-primary-700 hover:text-indigo-800">Admin Registration</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;