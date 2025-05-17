const VenueCard = ({ venue, booking }) => {
  return (
    <div className="bg-white p-5 border rounded-lg shadow-md hover:shadow-lg">
      <h3 className="text-lg font-semibold">{venue}</h3>
      
      {/* Only show booking details if there's a booking */}
      {booking ? (
        <div className="mt-3 text-sm text-gray-600">
          <p><strong>Start Date:</strong> {booking.start_date}</p>
          <p><strong>End Date:</strong> {booking.end_date}</p>
          <p><strong>Status:</strong> {booking.status}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-green-500">Available</p>
      )}
    </div>
  );
};

export default VenueCard;
