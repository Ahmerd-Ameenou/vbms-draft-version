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
          {/* Modern Welcome Title - Reduced margin-top */}
          <div className="w-full max-w-5xl px-6 mt-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Admin Dashboard</span>
            </h1>
            <p className="text-gray-500 mt-1 text-md">
              Efficiently oversee reservations, approvals, and reporting
            </p>
          </div>

          {/* Main buttons - Reduced gap and margins */}
          <div className="flex gap-4 justify-center w-full max-w-5xl flex-nowrap mt-2 px-4">
            {/* USERS button */}
            <SquareButton
              icon={<FaUsers className="text-lg" />}
              text="USERS"
              to="/users"
              className="h-28" // Reduced height
            />

            {/* Booked Venues */}
            <SquareButton
              icon={<FaCalendarAlt className="text-lg" />}
              text="BOOKED VENUES"
              to="/booked-venues"
              className="h-28"
            />

            {/* Approve/Reject Bookings */}
            <SquareButton
              icon={<FaClipboardCheck className="text-lg" />}
              text="APPROVE BOOKINGS"
              to="/approve-reject-bookings"
              className="h-28"
            />

            {/* Reports Button - Now inline with others */}
            <SquareButton
              icon={<FaFileAlt className="text-lg" />}
              text="REPORTS"
              to="/report"
              className="h-28"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDasboard;