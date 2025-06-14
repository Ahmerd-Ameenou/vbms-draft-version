import { FaUsers, FaCalendarAlt, FaBoxOpen, FaFileAlt, FaBoxes, FaClipboardCheck } from 'react-icons/fa';
import Sidebar from '../Components/Layout/layout/AdminSidebar';
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
          {/* Modern Welcome Title */}
          <div className="w-full max-w-5xl px-6 mt-8 mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Admin Dashboard</span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
            Efficiently oversee reservations, approvals, and reporting
            </p>
          </div>

          <div className="flex gap-8 justify-center w-full max-w-5xl flex-wrap mt-4">
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