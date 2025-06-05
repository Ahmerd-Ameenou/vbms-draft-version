import { FaUsers, FaCalendarAlt, FaBoxes, FaClipboardCheck, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from "../../../assets/logo.png";

const AdminSidebar = ({ onLogout }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col fixed top-0 left-0 bottom-0 z-10 border-r border-gray-500">
      {/* Header with Logo */}
      <div className="px-6 h-[73px] bg-white flex items-center justify-center gap-4">
        <img src={logo} alt="AIU Logo" className="h-15" />
        <h1 className="text-lg font-medium text-gray-800 m-0">AIU VENUE BOOKING</h1>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 py-5 px-4 space-y-3">
        {/* USERS - Entire area clickable */}
        <Link to="/users" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-9 h-9 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaUsers className="text-white text-lg" />
            </div>
            <span className="text-white font-normal">USERS</span>
          </div>
        </Link>

        {/* MANAGE INVENTORY */}
        <Link to="/inventory" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-9 h-9 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaBoxes className="text-white text-lg" />
            </div>
            <span className="text-white font-normal">MANAGE INVENTORY</span>
          </div>
        </Link>

        {/* BOOKED VENUES */}
        <Link to="/booked-venues" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-9 h-9 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaCalendarAlt className="text-white text-lg" />
            </div>
            <span className="text-white font-normal">BOOKED VENUES</span>
          </div>
        </Link>

        {/* APPROVE/REJECT BOOKINGS */}
        <Link to="/approve-reject-bookings" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-9 h-9 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaClipboardCheck className="text-white text-lg" />
            </div>
            <span className="text-white font-normal">APPROVE/REJECT BOOKINGS</span>
          </div>
        </Link>

        {/* GENERATE BOOKING REPORTS */}
        <Link to="/report" className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-9 h-9 flex items-center justify-center bg-[#0ba9a9] rounded-lg mr-3">
              <FaFileAlt className="text-white text-lg" />
            </div>
            <span className="text-white font-normal">GENERATE REPORTS</span>
          </div>
        </Link>
      </nav>

      {/* Logout Button - Positioned higher */}
      <div className="p-4 mt-auto">
        <button 
          onClick={onLogout} 
          className="flex items-center justify-center bg-transparent text-white border-none cursor-pointer text-sm py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors"
        >
          <FaSignOutAlt className="mr-2 text-[#0ba9a9] text-base" /> 
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;