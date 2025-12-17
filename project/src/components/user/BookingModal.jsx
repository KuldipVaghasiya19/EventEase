import { useState } from 'react';
import apiClient from '../../utils/apiClient';

const BookingModal = ({ event, onClose, onSuccess }) => {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async () => {
    setLoading(true);
    setError('');
    try {
      // Maps to @PostMapping("/user/book/{eventId}") in BookingController
      const response = await apiClient.post(`/bookings/user/book/${event.id}`, { seats });
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-scale-in">
        <h2 className="text-2xl font-bold mb-4">Book Tickets</h2>
        <p className="text-gray-600 mb-6">Select number of seats for <span className="font-bold">{event.name}</span></p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Seats</label>
          <input
            type="number"
            min="1"
            max={event.totalSeats - event.bookedSeats}
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value))}
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-2">Available: {event.totalSeats - event.bookedSeats} seats</p>
        </div>

        <div className="flex gap-4">
          <button onClick={handleBooking} disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;