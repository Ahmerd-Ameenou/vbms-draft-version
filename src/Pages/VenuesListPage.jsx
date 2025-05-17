import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Sidebar from '../Components/Layout/layout/Sidebar';
import VenueCard from '../Components/Layout/ui/VenueCard';

const VenuesListPage = () => {
  const navigate = useNavigate();

  // Hardcoded list of venues
  const venues = [
    "Auditorium", "Convocation Hall", "Convocation Foyer",
    "Lecture Theatre 1 (LT1)", "Lecture Theatre 2 (LT2)",
    "Lecture Theatre 3 (LT3)", "Lecture Theatre 4 (LT4)",
    "Lecture Theatre 5 (LT5)", "Lecture Theatre 6 (LT6)",
    "Student Center Level 1", "Student Center Level 2"
  ];

  // Hardcoded booking data for the sake of this demo
  const bookings = {
    "Auditorium": {
      start_date: "2025-05-20",
      end_date: "2025-05-20",
      status: "Booked"
    },
    "Convocation Hall": {
      start_date: "2025-05-21",
      end_date: "2025-05-21",
      status: "Booked"
    },
    // Add booking data for other venues here if necessary
  };

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
              <Link 
                key={venue} 
                to={`/book/${encodeURIComponent(venue)}`}
                className="no-underline text-inherit"
              >
                <VenueCard venue={venue} booking={bookings[venue]} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuesListPage;
