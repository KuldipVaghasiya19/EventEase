import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    course: '',
    currentlyStudyingOrNot: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    // CRITICAL: The keys here must match User.java exactly
    const registrationPayload = {
      name: formData.name,       // Must not be null
      email: formData.email,     // Must not be null
      password: formData.password, // Must not be null
      university: formData.university, // Must not be null
      course: formData.course,         // Must not be null
      currentlyStudyingOrNot: formData.currentlyStudyingOrNot // Boolean Wrapper
    };

    const { data, error: signUpError } = await signUp(registrationPayload, 'user');

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return;
    }

    if (data) {
      alert('Registration successful! Redirecting to login...');
      navigate('/login/user');
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">User Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Jane Doe" required />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="jane@example.com" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>University</label>
              <input type="text" name="university" value={formData.university} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Course</label>
              <input type="text" name="course" value={formData.course} onChange={handleChange} className={inputClass} required />
            </div>
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" required />
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="••••••••" required />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input type="checkbox" id="studying" name="currentlyStudyingOrNot" checked={formData.currentlyStudyingOrNot} onChange={handleChange} className="h-4 w-4 text-blue-600" />
            <label htmlFor="studying" className="text-sm text-gray-700 font-medium">Currently Studying</label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account? <Link to="/login/user" className="text-blue-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;