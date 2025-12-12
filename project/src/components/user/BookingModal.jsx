import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const BookingModal = ({ event, onClose, onSuccess }) => {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (seats > event.available_seats) {
        alert('Not enough seats available!');
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            event_id: event.id,
            seats_booked: seats,
            total_price: seats * event.price,
            booking_date: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('events')
        .update({ available_seats: event.available_seats - seats })
        .eq('id', event.id);

      if (updateError) throw updateError;

      onSuccess(data[0]);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Book Tickets</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.name}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Time: {event.time}</p>
            <p>Location: {event.location}</p>
            <p>Price per seat: ${event.price}</p>
            <p className="font-semibold text-primary-600">
              Available Seats: {event.available_seats}
            </p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Seats
            </label>
            <input
              type="number"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              min="1"
              max={event.available_seats}
              className="input-field"
              required
            />
          </div>

          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-primary-600">
                ${(seats * event.price).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
