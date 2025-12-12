import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockBookings, mockEvents } from '../../utils/mockDatabase';
import { downloadTicketPdf } from '../../utils/pdfTicketGenerator';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    // MOCK: Simulate fetching user's bookings and joining event data
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Filter bookings by current mock user's ID
        const userBookings = mockBookings
            .filter(booking => booking.user_id === user.id)
            .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));

        setBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, eventId, seatsBooked) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    // MOCK: Simulate database transaction for cancellation
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        // 1. MOCK DELETE BOOKING
        const initialLength = mockBookings.length;
        let newMockBookings = mockBookings.filter(b => b.id !== bookingId);
        mockBookings.splice(0, mockBookings.length, ...newMockBookings); // Update global mock

        if (mockBookings.length === initialLength) {
            throw new Error('Mock Booking not found for deletion.');
        }

        // 2. MOCK UPDATE EVENT
        const eventIndex = mockEvents.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            mockEvents[eventIndex].available_seats += seatsBooked;
        }

        fetchBookings();
        alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking. Please try again.');
    }
  };

  // UPDATED FUNCTION: Uses the PDF generator utility
  const handleDownloadTicket = async (booking) => {
    try {
        await downloadTicketPdf(booking, booking.events);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF ticket. Make sure jspdf and html2canvas are installed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your event bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">You have no bookings yet.</p>
            <a href="/user/events" className="btn-primary inline-block">
              Browse Events
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="md:flex">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 md:w-48 p-6 flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-5xl font-bold mb-2">
                        {new Date(booking.events.date).getDate()}
                      </p>
                      <p className="text-lg">
                        {new Date(booking.events.date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {booking.events.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Booking ID: {booking.id.slice(0, 8)}...
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Confirmed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-semibold text-gray-800">{booking.events.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold text-gray-800">{booking.events.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Seats</p>
                        <p className="font-semibold text-gray-800">{booking.seats_booked}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Booking Status</p>
                        <p className="font-semibold text-primary-600">Confirmed (FREE)</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDownloadTicket(booking)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download Ticket
                      </button>
                      <button
                        onClick={() =>
                          handleCancelBooking(booking.id, booking.events.id, booking.seats_booked)
                        }
                        className="btn-danger"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;