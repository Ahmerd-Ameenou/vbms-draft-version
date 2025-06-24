import { FaUsers, FaCalendarAlt, FaBoxes, FaClipboardCheck, FaFileAlt, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from "../../../assets/logo.png";

const AdminSidebar = ({ onLogout }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col fixed top-0 left-0 bottom-0 z-10 border-r border-gray-500">
      {/* Header with Logo - Bold text and increased spacing */}
      <div className="px-4 h-16 bg-white flex items-center justify-center gap-3">
        <img src={logo} alt="AIU Logo" className="h-10" />
        <h1 className="text-sm font-bold text-gray-800">AIU VENUE BOOKING</h1>
      </div>
      
      {/* Navigation Menu - Increased spacing */}
      <nav className="flex-grow py-3 px-3 space-y-3 overflow-y-auto">
        {/* HOME BUTTON */}
        <Link to="/admin-dashboard" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaHome className="text-white text-sm" />
            </div>
            <span className="text-white font-normal text-sm">HOME</span>
          </div>
        </Link>

        {/* USERS */}
        <Link to="/users" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaUsers className="text-white text-sm" />
            </div>
            <span className="text-white font-normal text-sm">USERS</span>
          </div>
        </Link>

        

        {/* BOOKED VENUES */}
        <Link to="/booked-venues" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaCalendarAlt className="text-white text-sm" />
            </div>
            <span className="text-white font-normal text-sm">BOOKED VENUES</span>
          </div>
        </Link>

        {/* APPROVE/REJECT BOOKINGS */}
        <Link to="/approve-reject-bookings" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaClipboardCheck className="text-white text-sm" />
            </div>
            <span className="text-white font-normal text-sm">APPROVE BOOKINGS</span>
          </div>
        </Link>

        {/* GENERATE REPORTS */}
        <Link to="/report" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaFileAlt className="text-white text-sm" />
            </div>
            <span className="text-white font-normal text-sm">REPORTS</span>
          </div>
        </Link>
      </nav>

      {/* Logout Button - Perfectly positioned at bottom */}
      <div className="p-3 mt-auto border-t border-gray-700">
        <button 
          onClick={onLogout} 
          className="flex items-center justify-center w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
        >
          <FaSignOutAlt className="mr-2 text-[#0ba9a9]" />
          <span className="text-sm">LOGOUT</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;