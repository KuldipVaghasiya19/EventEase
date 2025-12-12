import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';

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
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          events (*)
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, eventId, seatsBooked) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (deleteError) throw deleteError;

      const { data: eventData } = await supabase
        .from('events')
        .select('available_seats')
        .eq('id', eventId)
        .single();

      const { error: updateError } = await supabase
        .from('events')
        .update({ available_seats: eventData.available_seats + seatsBooked })
        .eq('id', eventId);

      if (updateError) throw updateError;

      fetchBookings();
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking. Please try again.');
    }
  };

  const handleDownloadTicket = (booking) => {
    const ticketContent = `
      ╔════════════════════════════════════╗
      ║      EVENT TICKET - CONFIRMED      ║
      ╚════════════════════════════════════╝

      Booking ID: ${booking.id}
      Event: ${booking.events.name}
      Date: ${new Date(booking.events.date).toLocaleDateString()}
      Time: ${booking.events.time}
      Location: ${booking.events.location}
      Seats Booked: ${booking.seats_booked}
      Total Price: $${booking.total_price}
      Booking Date: ${new Date(booking.booking_date).toLocaleString()}

      ╔════════════════════════════════════╗
      ║   Thank you for your booking!      ║
      ╚════════════════════════════════════╝
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${booking.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
                        <p className="text-sm text-gray-500">Total Paid</p>
                        <p className="font-semibold text-primary-600">${booking.total_price}</p>
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
