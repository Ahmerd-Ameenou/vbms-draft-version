import { FaUsers, FaCalendarAlt, FaQuestionCircle, FaBoxOpen } from 'react-icons/fa';
import Sidebar from '../Components/Layout/layout/Sidebar';
import SquareButton from '../Components/Layout//layout/SquareButton';

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
            <SquareButton icon={<FaUsers />} text="USER" to="#" />
            <SquareButton 
              icon={<FaCalendarAlt />} 
              text="CHECK AVAILABLE VENUES" 
              to="/available-venues"
            />
            <SquareButton icon={<FaCalendarAlt />} text="BOOK VENUES" to="/venues" />
            <SquareButton icon={<FaQuestionCircle />} text="REQUEST BOOKING STATUS" to="/booking-status" />
            <SquareButton icon={<FaBoxOpen />} text="ITEMS RETURN FORM" to="/items-return" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;