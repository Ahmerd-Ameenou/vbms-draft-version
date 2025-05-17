import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import Sidebar from '../Components/Layout/layout/Sidebar';
import VenueCard from '../Components/Layout/ui/VenueCard';
import { supabase } from '../Supabase-client';

const AvailableVenuesPage = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenuesAndBookings = async () => {
      try {
        // Fetching venues data from the 'venues' table
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('id, name');  // Selecting 'id' and 'name' of venues

        if (venueError) {
          throw venueError;
        }

        // Fetching bookings data from the 'bookings' table
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('venue_id, start_date, end_date, time'); // Selecting 'start_date', 'end_date', 'time'

        if (bookingError) {
          throw bookingError;
        }

        // Merging venue data with booking data and adding a hardcoded 'booked' field
        const mergedData = venueData.map((venue) => {
          const booking = bookingData.find(
            (booking) => booking.venue_id === venue.id
          );

          return {
            ...venue,
            start_date: booking ? booking.start_date : null,
            end_date: booking ? booking.end_date : null,
            time: booking ? booking.time : null,
            booked: booking ? true : false,  // Hardcoded 'booked' status
          };
        });

        // Filter only the venues that have bookings (i.e., start_date and end_date are not null)
        const filteredVenues = mergedData.filter(venue => venue.start_date && venue.end_date);

        setVenues(filteredVenues);
      } catch (err) {
        setError(err.message || 'Failed to fetch venues and bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchVenuesAndBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/dashboard';
      }} />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <div className="p-5 mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="absolute left-5 top-5 flex items-center gap-2 py-2 px-4 bg-white border-2 border-blue-500 rounded-lg text-blue-500 text-sm font-semibold cursor-pointer z-10 hover:bg-blue-50"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-5 max-w-5xl mx-auto">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableVenuesPage;
