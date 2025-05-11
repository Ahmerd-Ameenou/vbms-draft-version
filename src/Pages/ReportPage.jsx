import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from '../Components/Layout/layout/Sidebar';

const ReportPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([
    { id: 1, venue: 'Auditorium', date: '2024-03-01', organizer: 'Computer Club' },
    { id: 2, venue: 'LT1', date: '2024-03-05', organizer: 'Robotics Team' },
  ]);

  useEffect(() => {
    const filtered = bookings.filter(booking => 
      new Date(booking.date).toDateString() === selectedDate.toDateString()
    );
    setBookings(filtered);
  }, [selectedDate]);

  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }} />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <div className="max-w-3xl mx-auto my-5 p-6 bg-white rounded-xl shadow-md">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 py-2 px-4 bg-white border-2 border-blue-500 rounded-lg text-blue-500 text-sm font-semibold cursor-pointer hover:bg-blue-50 mb-4"
          >
            ← Back
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Reports</h2>
          
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select event date"
            className="p-2 border-2 border-blue-500 rounded-lg mb-4"
          />
          
          <div className="border-2 border-blue-500 rounded-lg p-5 mt-5">
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <div key={booking.id} className="p-4 my-3 bg-blue-50 rounded-lg">
                  <h3 className="text-base font-semibold text-gray-800">{booking.venue}</h3>
                  <p className="text-sm text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Organizer: {booking.organizer}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No bookings found for selected date</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;