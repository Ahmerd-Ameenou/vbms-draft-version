import { Link } from 'react-router-dom';

const VenueCard = ({ venue, bookingInfo }) => {
  // Handle single booking or multiple bookings
  const bookings = Array.isArray(bookingInfo) ? bookingInfo : [bookingInfo].filter(Boolean);
  const isAvailable = bookings.length === 0 || bookings.every(b => b.status === 'available');

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
      {/* Card Content */}
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-800">{venue}</h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAvailable ? 'AVAILABLE' : 'BOOKED'}
          </span>
        </div>

        {bookings.length > 0 ? (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 mb-1">Booked Slots:
              Can Book ouside these times!
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              {bookings.map((booking, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1">-</span>
                  <span>
                    {booking.date} | {booking.startTime} - {booking.endTime}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Available For Booking!</p>
        )}
      </div>

      {/* Book Now Button */}
      <div className="h-10 px-4 pb-3 flex items-end">
        <Link 
          to={`/book/${encodeURIComponent(venue)}`}
          className="w-full py-1.5 px-3 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors text-center block"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default VenueCard; 