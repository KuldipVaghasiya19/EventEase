import { useEffect, useState } from 'react';
import { downloadTicketPdf } from '../../utils/pdfTicketGenerator';

const BookingSuccessModal = ({ booking, event, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  const handleDownloadTicket = async () => {
    setDownloading(true);

    try {
        await downloadTicketPdf(booking, event);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF ticket. Make sure jspdf and html2canvas are installed.');
    } finally {
        // Use a timeout to ensure the loading state is visible for a minimum duration
        setTimeout(() => {
            setDownloading(false);
        }, 1000); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-bounce-slow">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your tickets have been successfully booked</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{event.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-semibold">Booking ID:</span>
                <span>{booking.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Date:</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Time:</span>
                <span>{event.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Seats:</span>
                <span>{booking.seats_booked}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                <span className="font-bold text-gray-800">Status:</span>
                <span className="font-bold text-primary-600">Confirmed</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownloadTicket}
              disabled={downloading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
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
                  Download Ticket (PDF)
                </>
              )}
            </button>
            <button onClick={onClose} className="w-full btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;