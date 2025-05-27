import { useState, useEffect } from 'react';
import { supabase } from '../Supabase-client';

function ApproveRejectBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to format time in 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Fetch bookings with status 'pending'
  const fetchBookings = async () => {
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
        created_at,
        status,
        venues (
          name
        ),
        booking_items (
          id,
          quantity,
          items (
            name
          )
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Failed to fetch bookings: ' + error.message);
      setBookings([]);
    } else {
      setBookings(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (bookingId) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'approved' })
      .eq('id', bookingId);

    if (error) {
      alert('Error approving booking: ' + error.message);
    } else {
      alert('Booking approved!');
      fetchBookings();
    }
  };

  const handleReject = async (bookingId) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', bookingId);

    if (error) {
      alert('Error rejecting booking: ' + error.message);
    } else {
      alert('Booking rejected!');
      fetchBookings();
    }
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${showModal ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-900">
            <h1 className="text-2xl font-bold text-white">Booking Approvals</h1>
            <p className="text-blue-100">Review and manage pending booking requests</p>
          </div>

          {/* Empty State */}
          {bookings.length === 0 && !loading && (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No pending bookings</h3>
              <p className="mt-1 text-gray-500">All booking requests have been processed</p>
            </div>
          )}

          {/* Bookings Table */}
          {bookings.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.venues?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">ID: {booking.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.student_name}</div>
                        <div className="text-sm text-gray-500">{booking.student_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <span className="font-semibold">Purpose:</span> {booking.purpose}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-semibold">Phone:</span> {booking.phone}
                        </div>
                        {booking.club && (
                          <div className="text-sm text-gray-500">
                            <span className="font-semibold">Club:</span> {booking.club}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-semibold">Start:</span> {booking.start_date} {formatTime(booking.start_time)}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-semibold">End:</span> {booking.end_date} {formatTime(booking.end_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleView(booking)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col z-50">
            {/* Header with close button */}
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white">
                Booking Details - {selectedBooking.venues?.name || 'N/A'}
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 focus:outline-none text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Student Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-4">Student Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                      <div className="mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-800 font-medium">
                        {selectedBooking.student_name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                      <div className="mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-800 font-medium">
                        {selectedBooking.student_id}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-800 font-medium">
                        {selectedBooking.phone}
                      </div>
                    </div>
                    {selectedBooking.club && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Club/Association</label>
                        <div className="mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-800 font-medium">
                          {selectedBooking.club}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Details Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-4">Booking Details</h4>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <div className="mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-800 min-h-[100px]">
                      {selectedBooking.purpose}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <div className="mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-800 font-medium">
                        {selectedBooking.start_date}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <div className="mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-800 font-medium">
                        {formatTime(selectedBooking.start_time)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <div className="mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-800 font-medium">
                        {selectedBooking.end_date}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <div className="mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-800 font-medium">
                        {formatTime(selectedBooking.end_time)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requested Items Section - Now properly included */}
                {selectedBooking.booking_items && selectedBooking.booking_items.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-bold text-blue-800 mb-4">Requested Items</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedBooking.booking_items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.items?.name || 'Unknown Item'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Close Button */}
            <div className="bg-gray-100 px-6 py-4 flex justify-end border-t sticky bottom-0">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApproveRejectBookings;