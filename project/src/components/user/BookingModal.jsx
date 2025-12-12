import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockBookings, mockEvents, uuidv4 } from '../../utils/mockDatabase';

const BookingModal = ({ event, onClose, onSuccess }) => {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    // MOCK: Simulate database transaction
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const eventIndex = mockEvents.findIndex(e => e.id === event.id);

      if (eventIndex === -1) {
          throw new Error('Mock Event not found.');
      }

      const currentEvent = mockEvents[eventIndex];

      if (seats > currentEvent.available_seats) {
        alert('Not enough seats available!');
        return;
      }

      // 1. MOCK INSERT BOOKING
      const newBooking = {
          id: uuidv4(),
          user_id: user.id,
          event_id: currentEvent.id,
          seats_booked: seats,
          booking_date: new Date().toISOString(),
          events: { // Denormalized data to mimic the database join for MyBookings.jsx
            id: currentEvent.id,
            name: currentEvent.name,
            date: currentEvent.date,
            time: currentEvent.time,
            location: currentEvent.location,
          }
      };
      mockBookings.push(newBooking);

      // 2. MOCK UPDATE EVENT
      currentEvent.available_seats -= seats;
      
      onSuccess(newBooking);

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

          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <span className="text-lg font-semibold text-primary-700">
              Your booking is FREE!
            </span>
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