import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from '../Components/Layout/layout/Sidebar';
import { supabase } from '../Supabase-client';

// jsPDF and autotable for PDF export
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

        // Fetch bookings where start_date matches selected date exactly
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
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedDate]);

  const downloadSingleBookingPDF = (booking) => {
    const doc = new jsPDF();
    doc.text('Booking Report', 14, 15);

    const tableColumn = [
      'Field', 'Details'
    ];
    const tableRows = [
      ['ID', booking.id],
      ['Venue Name', booking.venues?.name || 'N/A'],
      ['Student Name', booking.student_name],
      ['Student ID', booking.student_id],
      ['Phone', booking.phone],
      ['Purpose', booking.purpose],
      ['Start Date', new Date(booking.start_date).toLocaleDateString()],
      ['End Date', new Date(booking.end_date).toLocaleDateString()],
      ['Start Time', booking.start_time],
      ['End Time', booking.end_time],
      ['Club', booking.club],
      ['Booked At', new Date(booking.created_at).toLocaleString()],
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(`booking_report_${booking.id}.pdf`);
  };

  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar
        onLogout={() => {
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }}
      />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <div className="max-w-4xl mx-auto my-5 p-6 bg-white rounded-xl shadow-md">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 py-2 px-4 bg-white border-2 border-blue-500 rounded-lg text-blue-500 text-sm font-semibold cursor-pointer hover:bg-blue-50 mb-4"
          >
            ← Back
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Reports for {selectedDate.toLocaleDateString()}</h2>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select event date"
            className="p-2 border-2 border-blue-500 rounded-lg mb-6"
          />

          {loading && <p>Loading bookings...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && bookings.length === 0 && (
            <p className="text-gray-600">No bookings found for selected date</p>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50">
                  <p><strong>Venue:</strong> {booking.venues?.name || 'N/A'}</p>
                  <p><strong>Student Name:</strong> {booking.student_name}</p>
                  <p><strong>Student ID:</strong> {booking.student_id}</p>
                  <p><strong>Phone:</strong> {booking.phone}</p>
                  <p><strong>Purpose:</strong> {booking.purpose}</p>
                  <p><strong>Start Date:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
                  <p><strong>Start Time:</strong> {booking.start_time}</p>
                  <p><strong>End Time:</strong> {booking.end_time}</p>
                  <p><strong>Club:</strong> {booking.club}</p>
                  <p><strong>Booked At:</strong> {new Date(booking.created_at).toLocaleString()}</p>

                  <button
                    onClick={() => downloadSingleBookingPDF(booking)}
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
