import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Sidebar from '../Components/Layout/layout/Sidebar';
import { supabase } from '../Supabase-client';

const VenueCard = ({ venue, bookings }) => {
  return (
    <div className="border p-4 rounded shadow bg-white h-full flex flex-col justify-between">
      <h3 className="font-bold text-lg mb-2">{venue}</h3>
      <div className="flex-grow">
        <strong>Booked Slots:</strong>
        {bookings.length > 0 ? (
          <ul className="list-disc ml-5 mt-1">
            {bookings.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-green-600 font-semibold">Available</p>
        )}
      </div>
    </div>
  );
};

const VenuesListPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingsByVenue, setBookingsByVenue] = useState({});
  const [loading, setLoading] = useState(false);

  // Hardcoded list of venues - replace with dynamic if needed
  const venues = [
    "Auditorium", "Convocation Hall", "Convocation Foyer",
    "Lecture Theatre 1 (LT1)", "Lecture Theatre 2 (LT2)",
    "Lecture Theatre 3 (LT3)", "Lecture Theatre 4 (LT4)",
    "Lecture Theatre 5 (LT5)", "Lecture Theatre 6 (LT6)",
    "Student Center Level 1", "Student Center Level 2"
  ];

  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookings = async () => {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD

      // Fetch approved bookings that overlap with selected date
      const { data, error } = await supabase
        .from('bookings')
        .select('id, venue_name, start_date, end_date, time, status')
        .eq('status', 'approved')
        .lte('start_date', dateStr)
        .gte('end_date', dateStr);

      if (error) {
        console.error('Error fetching bookings:', error);
        setBookingsByVenue({});
        setLoading(false);
        return;
      }

      // Group bookings by venue_name
      const grouped = {};
      data.forEach(b => {
        if (!grouped[b.venue_name]) grouped[b.venue_name] = [];
        grouped[b.venue_name].push(b);
      });

      setBookingsByVenue(grouped);
      setLoading(false);
    };

    fetchBookings();
  }, [selectedDate]);

  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar
        onLogout={() => {
          localStorage.removeItem('isAuthenticated');
          navigate('/dashboard');
        }}
      />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <div className="p-5 mt-8 max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="absolute left-5 top-5 flex items-center gap-2 py-2 px-4 bg-white border-2 border-blue-500 rounded-lg text-blue-500 text-sm font-semibold cursor-pointer z-10 hover:bg-blue-50"
          >
            ← Back
          </button>

          <div className="mb-5 max-w-xs">
            <label className="block font-semibold mb-2">Select Booking Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="p-2 border-2 border-blue-500 rounded-lg w-full"
              minDate={new Date()}
            />
          </div>

          {loading && <p>Loading bookings...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-5">
            {venues.map((venue) => {
              const bookings = bookingsByVenue[venue] || [];

              // Format booked slots string, e.g. "- 20/05/2025 | 10:00 AM - 12:00 PM"
              const bookedSlots = bookings.map(b => {
                return `- ${selectedDate.toLocaleDateString()} | ${b.time}`;
              });

              return (
                <Link
                  key={venue}
                  to={`/book/${encodeURIComponent(venue)}`}
                  className="no-underline text-inherit"
                >
                  <VenueCard 
                    venue={venue} 
                    bookings={bookedSlots}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuesListPage;
