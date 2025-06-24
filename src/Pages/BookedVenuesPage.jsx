import { useState, useEffect } from 'react';
import { supabase } from '../Supabase-client';
import AdminSidebar from '../Components/Layout/layout/AdminSidebar';

function BookedVenuesPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchBookedVenues() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            student_name,
            student_id,
            phone,
            purpose,
            start_date,
            end_date,
            start_time,
            end_time,
            club,
            status,
            created_at,
            cancellation_reason,
            rejection_reason,
            cancelled_at,
            venues (
              name,
              created_at
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const filtered = showAllBookings 
          ? data 
          : data.filter(booking => {
              const endDateTimeStr = `${booking.end_date}T${booking.end_time}`;
              const endDateTime = new Date(endDateTimeStr);
              return endDateTime > currentTime && booking.status === 'approved';
            });

        setBookings(filtered);
      } catch (err) {
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBookedVenues();
  }, [currentTime, showAllBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!cancelReason) {
      alert('Please select a cancellation reason');
      return;
    }

    try {
      const bookingToCancel = bookings.find(b => b.id === bookingId);
      if (!bookingToCancel) throw new Error('Booking not found');
      
      const startDateTime = new Date(`${bookingToCancel.start_date}T${bookingToCancel.start_time}`);
      const endDateTime = new Date(`${bookingToCancel.end_date}T${bookingToCancel.end_time}`);
      
      if (endDateTime < currentTime) {
        throw new Error('Cannot cancel past bookings');
      }

      if (bookingToCancel.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled', 
          cancellation_reason: cancelReason,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: 'cancelled',
              cancellation_reason: cancelReason,
              cancelled_at: new Date().toISOString()
            } 
          : booking
      ));
      
      setCancellingBookingId(null);
      setCancelReason('');
      alert('Booking cancelled successfully!');
    } catch (err) {
      console.error('Cancellation error:', err);
      alert(`Failed to cancel booking: ${err.message}`);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 font-medium">Error loading booked venues: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-700 underline hover:text-red-600"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-blue-900 to-blue-900 px-6 py-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {showAllBookings ? 'All Booking History' : 'Booked Venues'}
              </h1>
              <p className="mt-1 text-blue-100">
                {showAllBookings ? 'Complete history of all venue reservations' : 'Currently active venue reservations'}
              </p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center space-x-4">
              <button
                onClick={() => setShowAllBookings(!showAllBookings)}
                className="flex items-center text-blue-100 hover:text-white transition-colors bg-blue-800 bg-opacity-30 px-3 py-1 rounded-md"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {showAllBookings ? 'Show Active Only' : 'View All History'}
              </button>
              <div className="flex items-center text-blue-100 bg-blue-800 bg-opacity-30 px-3 py-1 rounded-md">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last updated: {currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 sm:px-8">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {showAllBookings ? 'No bookings found' : 'No active bookings'}
              </h3>
              <p className="mt-1 text-gray-500">
                {showAllBookings 
                  ? 'No booking records exist in the system yet.' 
                  : 'All approved bookings have either passed or none have been made yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Venue
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Student
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                      Schedule
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Details
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Booked At
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => {
                    const startDateTime = new Date(`${booking.start_date}T${booking.start_time}`);
                    const endDateTime = new Date(`${booking.end_date}T${booking.end_time}`);
                    const isActive = currentTime >= startDateTime && currentTime <= endDateTime && booking.status === 'approved';
                    const isUpcoming = currentTime < startDateTime && booking.status === 'approved';
                    const isPast = endDateTime < currentTime;
                    const isCancellable = (isActive || isUpcoming) && booking.status === 'approved';

                    return (
                      <tr 
                        key={booking.id} 
                        className={
                          isActive ? "bg-green-50" : 
                          isUpcoming ? "bg-amber-50" :
                          booking.status === 'rejected' ? "bg-red-50" : 
                          booking.status === 'cancelled' ? "bg-purple-50" :
                          isPast ? "bg-gray-50" : 
                          "hover:bg-gray-50"
                        }
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                              isActive ? 'bg-green-100' :
                              isUpcoming ? 'bg-amber-100' :
                              booking.status === 'cancelled' ? 'bg-purple-100' :
                              'bg-gray-100'
                            }`}>
                              <svg className={`h-6 w-6 ${
                                isActive ? 'text-green-600' :
                                isUpcoming ? 'text-amber-600' :
                                booking.status === 'cancelled' ? 'text-purple-600' :
                                'text-gray-600'
                              }`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.venues?.name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {booking.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.student_name}</div>
                          <div className="text-sm text-gray-500">{booking.student_id}</div>
                          <div className="text-sm text-gray-500">{booking.phone}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-semibold">From:</span> {startDateTime.toLocaleDateString()}, {startDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="font-semibold">To:</span> {endDateTime.toLocaleDateString()}, {endDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          {isActive && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx={4} cy={4} r={3} />
                              </svg>
                              Active Now
                            </span>
                          )}
                          {isUpcoming && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mt-1">
                              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-amber-400" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx={4} cy={4} r={3} />
                              </svg>
                              Upcoming
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-semibold">Purpose:</span> {booking.purpose}
                          </div>
                          {booking.club && (
                            <div className="text-sm text-gray-500">
                              <span className="font-semibold">Club:</span> {booking.club}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            booking.status === 'cancelled' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                          {isPast && booking.status === 'approved' && (
                            <div className="text-xs text-gray-500 mt-1">Completed</div>
                          )}
                          {booking.status === 'rejected' && booking.rejection_reason && (
                            <div className="text-xs text-gray-700 mt-1">
                              <span className="font-medium">Reason:</span> {booking.rejection_reason}
                            </div>
                          )}
                          {booking.status === 'cancelled' && booking.cancellation_reason && (
                            <div className="text-xs text-gray-700 mt-1">
                              <span className="font-medium">Reason:</span> {booking.cancellation_reason}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {isCancellable && (
                            <div className="flex flex-col space-y-2">
                              {cancellingBookingId === booking.id ? (
                                <>
                                  <select
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md border"
                                  >
                                    <option value="">Select reason...</option>
                                    <option value="Rescheduling needed">Rescheduling needed</option>
                                    <option value="Event cancelled">Event cancelled</option>
                                    <option value="Venue no longer required">Venue no longer required</option>
                                    <option value="Change of plans">Change of plans</option>
                                    <option value="Other">Other</option>
                                  </select>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleCancelBooking(booking.id)}
                                      disabled={!cancelReason}
                                      className={`px-3 py-1 text-sm rounded-md ${cancelReason ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => {
                                        setCancellingBookingId(null);
                                        setCancelReason('');
                                      }}
                                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <button
                                  onClick={() => setCancellingBookingId(booking.id)}
                                  className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors text-sm"
                                >
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookedVenuesPage;