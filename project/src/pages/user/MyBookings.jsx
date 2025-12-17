import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/apiClient';
import { downloadTicketPdf } from '../../utils/pdfTicketGenerator';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      // Maps to @GetMapping("/user/mybookings")
      const response = await apiClient.get('/bookings/user/mybookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      // Maps to @DeleteMapping("/user/{bookingId}")
      await apiClient.delete(`/bookings/user/${bookingId}`);
      fetchBookings();
      alert('Booking cancelled successfully!');
    } catch (error) {
      alert('Error cancelling booking. Please try again.');
    }
  };

  const handleDownloadTicket = async (booking) => {
    try {
      await downloadTicketPdf(booking, booking.event);
    } catch (error) {
      alert('Failed to generate PDF ticket.');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading bookings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-gray-500 mb-4">You have no bookings yet.</p>
            <a href="/user/events" className="btn-primary inline-block">Browse Events</a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{booking.event.name}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>Status: <span className={booking.status === 'CANCELLED' ? 'text-red-600' : 'text-green-600'}>{booking.status}</span></p>
                    <p>Seats: {booking.seatsBooked} | Venue: {booking.event.venue}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleDownloadTicket(booking)} className="btn-primary">Download Ticket</button>
                  {booking.status !== 'CANCELLED' && (
                    <button onClick={() => handleCancelBooking(booking.id)} className="btn-danger">Cancel</button>
                  )}
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