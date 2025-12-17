import { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../utils/apiClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('eventease_user') || sessionStorage.getItem('eventease_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setUserRole(parsed.role);
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const signUp = async (userData, role = 'user') => {
    try {
      const endpoint = role === 'admin' ? '/auth/register/admin' : '/auth/register/user';
      const response = await apiClient.post(endpoint, userData);
      return { data: response.data, error: null };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed';
      return { data: null, error: msg };
    }
  };

  const signIn = async (credentials, roleType) => {
    try {
      const endpoint = roleType === 'admin' ? '/auth/login/admin' : '/auth/login/user';
      const response = await apiClient.post(endpoint, credentials);
      
      const userData = response.data;
      
      // Store user data in session for persistence and role-based navigation
      sessionStorage.setItem('eventease_user', JSON.stringify(userData));
      
      setUser(userData);
      setUserRole(userData.role); // Backend returns 'ADMIN' or 'USER'
      
      return { data: userData, error: null };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Login failed';
      return { data: null, error: msg };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('eventease_user');
      sessionStorage.removeItem('eventease_user');
      setUser(null);
      setUserRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};