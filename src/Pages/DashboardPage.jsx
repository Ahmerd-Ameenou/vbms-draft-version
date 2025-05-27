import { FaUsers, FaCalendarAlt, FaQuestionCircle, FaBoxOpen, FaUserCircle, FaUndoAlt, FaDoorOpen, FaMapMarkerAlt, FaRegBuilding } from 'react-icons/fa';
import Sidebar from '../Components/Layout/layout/Sidebar';
import SquareButton from '../Components/Layout/layout/SquareButton';
import { FaBookBookmark } from 'react-icons/fa6';

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }} />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <div className="flex-1 bg-white p-0 flex justify-center items-center">
          <div className="flex gap-8 justify-center w-full max-w-5xl flex-wrap mt-8">
          <SquareButton icon={<FaUserCircle />} text="USER PROFILE" to="/user-profile" />

            
           
            <SquareButton 
              icon={<FaDoorOpen />} 
              text="BOOK VENUES" 
              to="/venues" 
            />
            <SquareButton icon={<FaQuestionCircle />} text="REQUEST BOOKING STATUS" to="/booking-status" />
            <SquareButton icon={<FaUndoAlt />} text="ITEMS RETURN FORM" to="/items-return" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;