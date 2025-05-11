import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import Sidebar from '../Components/Layout/layout/Sidebar';
import VenueCard from '../components/Layout/ui/VenueCard';

const AvailableVenuesPage = () => {
  const navigate = useNavigate();
  const venues = [
    "Auditorium", "Convocation Hall", "Convocation Foyer",
    "Lecture Theatre 1 (LT1)", "Lecture Theatre 2 (LT2)",
    "Lecture Theatre 3 (LT3)", "Lecture Theatre 4 (LT4)",
    "Lecture Theatre 5 (LT5)", "Lecture Theatre 6 (LT6)",
    "Student Center Level 1", "Student Center Level 2"
  ];

  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
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
              <VenueCard key={venue} venue={venue} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableVenuesPage;