// Corrected import style for react-icons
import { FaCalendarAlt, FaFileAlt, FaHome, FaQuestionCircle, FaRegFileAlt, FaSignOutAlt, FaUsers } from "react-icons/fa";

// Ensure the logo import is correct
import logo from "../../../assets/logo.png"; // Adjust the path if necessary

// Import or define MenuItem component
import MenuItem from './MenuItem'; // Adjust the path if MenuItem is located elsewhere

const iconColor = '#0ba9a9';

const Sidebar = ({ onLogout }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col fixed top-0 left-0 bottom-0 z-10 border-r border-gray-500">
      <div className="px-6 h-[73px] bg-white flex items-center justify-center gap-4">
        <img src={logo} alt="AIU Logo" className="h-15" />
        <h1 className="text-lg font-bold text-gray-800 m-0">AIU VENUE BOOKING</h1>
      </div>
      
      <nav className="flex-1 py-5">
        <div className="mb-4">
          <MenuItem icon={<FaHome color={iconColor} />} text="HOME" to="/dashboard" />
        </div>
        <div className="mb-4">
          <MenuItem icon={<FaUsers color={iconColor} />} text="USER PROFILE" to="/user-profile" />
        </div>
        <div className="mb-4">
          <MenuItem icon={<FaCalendarAlt color={iconColor} />} text="BOOK VENUES" to="/venues" />
        </div>
        <div className="mb-4">
          <MenuItem icon={<FaQuestionCircle color={iconColor} />} text="REQUEST BOOKING STATUS" to="/booking-status" />
        </div>
        <div className="mb-4">
          <MenuItem icon={<FaRegFileAlt color={iconColor} />} text="adminDasboard" to="/admin" />
        </div>
      </nav>

      <div className="p-5 text-center">
        <button onClick={onLogout} className="flex items-center justify-center bg-transparent text-white border-none cursor-pointer text-sm py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors">
          <FaSignOutAlt className="mr-2" color={iconColor} /> LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
