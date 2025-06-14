import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from '../Components/Layout/layout/AdminSidebar';
import { supabase } from '../Supabase-client';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FiFile, FiCalendar, FiArrowLeft, FiLoader, FiAlertCircle } from 'react-icons/fi';

const ReportPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            venues(name),
            student_name,
            student_id,
            phone,
            purpose,
            start_date,
            end_date,
            start_time,
            end_time,
            club,
            created_at
          `)
          .eq('start_date', formattedDate)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setBookings(data || []);
      } catch (error) {
        setError('Failed to fetch bookings: ' + error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedDate]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      bookings.map(booking => ({
        'Venue': booking.venues?.name || 'N/A',
        'Student Name': booking.student_name,
        'Student ID': booking.student_id,
        'Phone': booking.phone,
        'Purpose': booking.purpose,
        'Start Date': new Date(booking.start_date).toLocaleDateString(),
        'End Date': new Date(booking.end_date).toLocaleDateString(),
        'Start Time': booking.start_time,
        'End Time': booking.end_time,
        'Club': booking.club,
        'Booked At': new Date(booking.created_at).toLocaleString()
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    
    // Generate Excel file with timestamp
    const dateStr = selectedDate.toISOString().split('T')[0];
    XLSX.writeFile(workbook, `bookings_${dateStr}.xlsx`);
  };

  return (
    <div className="flex min-h-screen font-sans relative bg-gray-50 text-gray-900">
      <Sidebar
        onLogout={() => {
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }}
      />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <div className="max-w-6xl mx-auto my-5 p-6 bg-white rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 py-2 px-4 bg-white border-2 border-blue-500 rounded-lg text-blue-500 text-sm font-semibold cursor-pointer hover:bg-blue-50"
            >
              <FiArrowLeft className="inline" /> Back to Dashboard
            </button>

            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              disabled={bookings.length === 0}
            >
              <FiFile className="inline" /> Export to Excel
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">
              Booking Reports for {selectedDate.toLocaleDateString()}
            </h2>
            
            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
              <FiCalendar className="text-blue-500" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select event date"
                className="p-2 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <FiLoader className="animate-spin text-3xl mb-4 text-blue-500" />
              <p>Loading bookings...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-6 flex items-center gap-3">
              <FiAlertCircle className="text-xl" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="p-8 bg-gray-50 text-center rounded-lg">
              <p className="text-lg">No bookings found for selected date</p>
              <p className="text-sm mt-2">Try selecting a different date to view bookings</p>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center">
                <p className="font-medium">
                  Showing <span className="font-bold">{bookings.length}</span> booking{bookings.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="border border-gray-200 bg-white rounded-lg p-4 transition-all hover:shadow-lg hover:bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{booking.venues?.name || 'Unnamed Venue'}</h3>
                        <p className="text-sm opacity-80">{booking.purpose}</p>
                      </div>
                      
                      <div>
                        <p className="font-semibold">{booking.student_name}</p>
                        <p className="text-sm opacity-80">ID: {booking.student_id}</p>
                        <p className="text-sm opacity-80">{booking.phone}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">
                          {new Date(booking.start_date).toLocaleDateString()} • {booking.start_time} - {booking.end_time}
                        </p>
                        {booking.club && (
                          <p className="text-sm opacity-80">Club: {booking.club}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;