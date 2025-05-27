import { FaUsers, FaCalendarAlt, FaBoxOpen, FaFileAlt, FaBoxes, FaClipboardCheck } from 'react-icons/fa';
import Sidebar from '../Components/Layout/layout/Sidebar';
import SquareButton from '../Components/Layout/layout/SquareButton';

function AdminDasboard() {
  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }} />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <div className="flex-1 bg-white p-0 flex flex-col items-center">
          <div className="flex gap-8 justify-center w-full max-w-5xl flex-wrap mt-8">
            {/* USERS button now navigates to /users */}
            <SquareButton
              icon={<FaUsers />}
              text="USERS"
              to="/users"  // Navigate to the new Users page
            />

            {/* Manage Inventory */}
            <SquareButton
              icon={<FaBoxes />}
              text="MANAGE INVENTORY"
              to="/inventory"  // Navigate to the Inventory page
            />

            {/* Booked Venues */}
            <SquareButton
              icon={<FaCalendarAlt />}
              text="BOOKED VENUES"
              to="/booked-venues"
            />

            {/* Approve/Reject Bookings */}
            <SquareButton
              icon={<FaClipboardCheck />}
              text="APPROVE/REJECT BOOKINGS"
              to="/approve-reject-bookings"
            />
          </div>

          {/* New Generate Booking Reports Button */}
          <div className="w-full flex justify-center mt-8">
            <SquareButton
              icon={<FaFileAlt />}
              text="GENERATE BOOKING REPORTS"
              to="/report"
              className="bg-blue-600 hover:bg-blue-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDasboard;
