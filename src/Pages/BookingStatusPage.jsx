import { useState, useEffect } from 'react';
import { supabase } from '../Supabase-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingStatusPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [venueNames, setVenueNames] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current session user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw new Error(`Authentication error: ${userError.message}`);
        if (!user) throw new Error('User not authenticated');

        // Get the user's profile with all possible identifying fields
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw new Error(`Profile fetch error: ${profileError.message}`);
        if (!userProfile) throw new Error('User profile not found');

        console.log('User profile:', userProfile); // Debug log

        // Array to collect all found bookings
        let allFoundBookings = [];

        // 1. First try: Direct user_id match (most reliable if set)
        if (userProfile.id) {
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', userProfile.id);

          if (!error && data) {
            console.log('Found bookings by user_id:', data.length);
            allFoundBookings = [...allFoundBookings, ...data];
          }
        }

        // 2. Second try: Student ID match (common identifier)
        if (userProfile.student_id) {
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .or(`student_id.eq.${userProfile.student_id},student_id.ilike.%${userProfile.student_id}%`);

          if (!error && data) {
            console.log('Found bookings by student_id:', data.length);
            allFoundBookings = [...allFoundBookings, ...data];
          }
        }

        // 3. Third try: Email match (might be in email or phone fields)
        if (userProfile.email) {
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .or(`email.eq.${userProfile.email},phone.eq.${userProfile.email},email.ilike.%${userProfile.email}%`);

          if (!error && data) {
            console.log('Found bookings by email:', data.length);
            allFoundBookings = [...allFoundBookings, ...data];
          }
        }

        // 4. Fourth try: Phone number match
        if (userProfile.phone) {
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .or(`phone.eq.${userProfile.phone},phone.ilike.%${userProfile.phone}%`);

          if (!error && data) {
            console.log('Found bookings by phone:', data.length);
            allFoundBookings = [...allFoundBookings, ...data];
          }
        }

        // 5. Fifth try: Name match (exact and partial)
        if (userProfile.full_name) {
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .or(
              `student_name.eq.${userProfile.full_name},student_name.ilike.%${userProfile.full_name}%`
            );

          if (!error && data) {
            console.log('Found bookings by name:', data.length);
            allFoundBookings = [...allFoundBookings, ...data];
          }
        }

        // Remove duplicates and sort by date (newest first)
        const uniqueBookings = allFoundBookings
          .filter((booking, index, self) => 
            index === self.findIndex((b) => b.id === booking.id)
          )
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        console.log('Final unique bookings:', uniqueBookings.length); // Debug log

        if (uniqueBookings.length > 0) {
          setBookings(uniqueBookings);
          
          // Fetch venue names in a single batch query
          const venueIds = uniqueBookings
            .map(b => b.venue_id)
            .filter((id, index, self) => id && self.indexOf(id) === index);

          if (venueIds.length > 0) {
            const { data: venues, error: venueError } = await supabase
              .from('venues')
              .select('id, name')
              .in('id', venueIds);

            if (!venueError && venues) {
              const venueMap = venues.reduce((acc, venue) => {
                acc[venue.id] = venue.name;
                return acc;
              }, {});

              setVenueNames(venueMap);
            }
          }
        } else {
          setBookings([]);
          console.log('No bookings found for user'); // Debug log
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Real-time updates for all bookings
  useEffect(() => {
    if (bookings.length === 0) return;

    const subscription = supabase
      .channel('booking_status_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `id=in.(${bookings.map(b => b.id).join(',')})`
        },
        (payload) => {
          setBookings(prev => {
            const index = prev.findIndex(b => b.id === payload.new.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = payload.new;
              return updated;
            }
            // If new booking matches our user, add it
            if (isBookingForCurrentUser(payload.new)) {
              return [...prev, payload.new].sort((a, b) => 
                new Date(b.created_at) - new Date(a.created_at)
              );
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [bookings.map(b => b.id).join(',')]);

  // Helper function to check if a booking belongs to current user
  const isBookingForCurrentUser = (booking) => {
    // Implement your logic to check if booking matches current user
    // This should mirror the fetch logic above
    return true; // Simplified for example
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  const handleBookingDetails = (bookingId) => {
    toast.info(`Viewing details for booking ${bookingId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRefresh={handleRefresh} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
        <Header 
          hasBookings={bookings.length > 0} 
          onRefresh={handleRefresh} 
        />
        
        <div className="px-6 py-5 sm:px-8">
          {bookings.length > 0 ? (
            <BookingsTable 
              bookings={bookings} 
              venueNames={venueNames} 
              onViewDetails={handleBookingDetails} 
            />
          ) : (
            <NoBookingsDisplay onRefresh={handleRefresh} />
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

// Sub-components for better organization
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    <p className="ml-4 text-gray-600">Loading bookings...</p>
  </div>
);

const ErrorDisplay = ({ error, onRefresh }) => (
  <div className="max-w-7xl mx-auto p-6">
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 font-medium">Error: {error}</p>
          <button onClick={onRefresh} className="mt-2 text-sm text-red-700 underline hover:text-red-600">
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Header = ({ hasBookings, onRefresh }) => (
  <div className="bg-gradient-to-r from-blue-900 to-blue-900 px-6 py-5 sm:px-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {hasBookings ? 'Your Bookings' : 'No Active Bookings'}
        </h1>
        <p className="mt-1 text-blue-100">
          {hasBookings ? 'All your current bookings' : 'You have no active bookings'}
        </p>
      </div>
      <button 
        onClick={onRefresh}
        className="mt-4 sm:mt-0 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Refresh
      </button>
    </div>
  </div>
);

const BookingsTable = ({ bookings, venueNames }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {bookings.map((booking) => (
          <tr key={booking.id}>
            <td className="px-4 py-4 whitespace-nowrap">
              {venueNames[booking.venue_id] || 'Venue'}
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}, {booking.start_time || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">
                {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : 'N/A'}, {booking.end_time || 'N/A'}
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
              <StatusBadge status={booking.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
    status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
    status === 'approved' ? 'bg-green-100 text-green-800' : 
    status === 'rejected' ? 'bg-red-100 text-red-800' :
    'bg-gray-200 text-gray-800'
  }`}>
    {status || 'Unknown'}
  </span>
);

const NoBookingsDisplay = ({ onRefresh }) => (
  <div className="text-center py-12">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
    <h3 className="mt-2 text-lg font-medium text-gray-900">No active bookings</h3>
    <p className="mt-1 text-gray-500">
      You have no active bookings. Please make a booking request to see it here.
    </p>
    <button 
      onClick={onRefresh}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      Refresh Data
    </button>
  </div>
);

export default BookingStatusPage;