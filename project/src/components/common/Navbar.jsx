import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-700 to-primary-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">EventBooker</span>
          </Link>

          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800 hover:underline transition-all duration-300"
            >
              Home
            </Link>

            {!user ? (
              <>
                <Link
                  to="/user/events"
                  className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800 hover:underline transition-all duration-300"
                >
                  Events
                </Link>
                <Link
                  to="/user/login"
                  className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800 hover:underline transition-all duration-300"
                >
                  User Login
                </Link>
                <Link
                  to="/admin/login"
                  className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800 hover:underline transition-all duration-300"
                >
                  Admin Login
                </Link>
              </>
            ) : (
              <>
                {userRole === 'admin' ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800 hover:underline transition-all duration-300"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/events"
                      className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800 hover:underline transition-all duration-300"
                    >
                      Manage Events
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/user/events"
                      className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800 hover:underline transition-all duration-300"
                    >
                      Events
                    </Link>
                    <Link
                      to="/user/bookings"
                      className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800 hover:underline transition-all duration-300"
                    >
                      My Bookings
                    </Link>
                  </>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 hover:underline transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
