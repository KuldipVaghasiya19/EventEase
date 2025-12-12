import { createContext, useState, useEffect, useContext } from 'react';
import { mockUsers } from '../utils/mockDatabase'; // IMPORTED FOR MOCK AUTH

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

  // MOCK PERSISTENCE: Simulate an already logged-in user using sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('mockUser');
    const storedRole = sessionStorage.getItem('mockUserRole');

    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setUserRole(storedRole);
    }
    setLoading(false);
  }, []);

  // MOCK SIGN UP
  const signUp = async (email, password, username, role = 'user') => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (mockUsers.some(u => u.email === email)) {
                // Mock Error: Simulate existing user check
                resolve({ data: null, error: { message: 'User with this email already exists (Mock Error)' } });
            } else {
                // Mock Success: Simulate new user creation and immediate login
                const newUser = { id: `u_${username}_${Date.now()}`, email, username, role, password };
                // NOTE: In a real mock app, you would add this to mockUsers, but for simplicity, we mock the sign-up process.
                sessionStorage.setItem('mockUser', JSON.stringify(newUser));
                sessionStorage.setItem('mockUserRole', role);
                setUser(newUser);
                setUserRole(role);
                resolve({ data: { user: newUser }, error: null });
            }
        }, 500); // Simulate network delay
    });
  };

  // MOCK SIGN IN
  const signIn = async (email, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Find user in mock data
            const foundUser = mockUsers.find(u => u.email === email && u.password === password);

            if (foundUser) {
                sessionStorage.setItem('mockUser', JSON.stringify(foundUser));
                sessionStorage.setItem('mockUserRole', foundUser.role);
                setUser(foundUser);
                setUserRole(foundUser.role);
                resolve({ data: { user: foundUser }, error: null });
            } else {
                // Mock Error: Invalid credentials
                resolve({ data: null, error: { message: 'Invalid credentials (Mock Error). Try admin@mock.com/password or user@mock.com/password.' } });
            }
        }, 500); // Simulate network delay
    });
  };

  // MOCK SIGN OUT
  const signOut = async () => {
    sessionStorage.removeItem('mockUser');
    sessionStorage.removeItem('mockUserRole');
    setUser(null);
    setUserRole(null);
  };

  const value = {
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};