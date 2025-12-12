import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">EventBooker</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover and book tickets for amazing events. Your next unforgettable experience is just a click away.
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/user/events" className="btn-primary text-lg px-8 py-3">
                Browse Events
              </Link>
              <Link
                to="/user/login"
                className="bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="animate-slide-up">
              {userRole === 'admin' ? (
                <Link to="/admin/dashboard" className="btn-primary text-lg px-8 py-3">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/user/events" className="btn-primary text-lg px-8 py-3">
                  Browse Events
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Discover Events</h3>
            <p className="text-gray-600">
              Browse through a wide variety of events happening near you
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Book your tickets instantly with our simple and secure booking process
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Access</h3>
            <p className="text-gray-600">
              Manage your bookings anytime, anywhere with instant ticket downloads
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of event enthusiasts and never miss out on amazing experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <>
                <Link
                  to="/user/signup"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-300"
                >
                  Sign Up Now
                </Link>
                <Link
                  to="/user/events"
                  className="bg-primary-500 hover:bg-primary-400 text-white font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-300"
                >
                  Browse Events
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
