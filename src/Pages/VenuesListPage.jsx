import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Layout/layout/Sidebar';
import VenueCard from '../Components/Layout/ui/VenueCard';
import { supabase } from '../Supabase-client';

const VenuesListPage = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch venues
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .order('name', { ascending: true });

      if (venuesError) throw venuesError;

      // Fetch bookings
      const now = new Date();
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('start_date', { ascending: true });

      if (bookingsError) throw bookingsError;

      // Filter only approved bookings that are still active
      const activeApprovedBookings = bookingsData.filter(booking => {
        const bookingEnd = new Date(`${booking.start_date}T${booking.end_time}`);
        return booking.status === 'approved' && bookingEnd > now;
      });

      // Organize bookings by venue
      const bookingsByVenue = {};
      activeApprovedBookings.forEach(booking => {
        if (!bookingsByVenue[booking.venue_id]) {
          bookingsByVenue[booking.venue_id] = [];
        }
        bookingsByVenue[booking.venue_id].push({
          date: new Date(booking.start_date).toLocaleDateString(),
          startTime: booking.start_time,
          endTime: booking.end_time,
          status: booking.status
        });
      });

      setVenues(venuesData);
      setBookings(bookingsByVenue);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time subscription to bookings table
    const subscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, fetchData)
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  if (loading) return <div>Loading venues...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/dashboard';
      }} />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">BOOK VENUES</h1>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 py-2 px-4 bg-white rounded-lg text-blue-600 text-sm font-semibold shadow-sm hover:bg-gray-100 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="mb-6 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
            <p className="font-semibold"> Venues with existing bookings remain available for booking outside of their booked slots.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map(venue => (
              <div key={venue.id} className="min-h-[250px]">
                <VenueCard
                  venue={venue.name}
                  bookingInfo={bookings[venue.id] || []}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuesListPage;
