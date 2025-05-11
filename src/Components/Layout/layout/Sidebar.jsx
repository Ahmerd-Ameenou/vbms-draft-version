// Corrected import style for react-icons
import { FaCalendarAlt, FaFileAlt, FaHome, FaQuestionCircle, FaRegFileAlt, FaSignOutAlt, FaUsers } from "react-icons/fa";

// Ensure the logo import is correct
import logo from "../../../assets/logo.png"; // Adjust the path if necessary

// Import or define MenuItem component
import MenuItem from './MenuItem'; // Adjust the path if MenuItem is located elsewhere

const Sidebar = ({ onLogout }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col fixed top-0 left-0 bottom-0 z-10 border-r border-gray-200">
      <div className="px-6 h-[73px] bg-white flex items-center justify-center gap-4">
        <img src={logo} alt="AIU Logo" className="h-15" />
        <h1 className="text-lg font-bold text-gray-800 m-0">AIU VENUE BOOKING</h1>
      </div>
      
      <nav className="flex-1 py-5">
        <MenuItem icon={<FaHome />} text="HOME" to="/dashboard" />
        <MenuItem icon={<FaUsers />} text="USER" />
          <MenuItem icon={<FaCalendarAlt />} text="CHECK AVAILABLE VENUES" to="/available-venues" />
          <MenuItem icon={<FaCalendarAlt />} text="BOOK VENUES" to="/venues" />
          <MenuItem icon={<FaQuestionCircle />} text="REQUEST BOOKING STATUS" to="/booking-status" />
          <MenuItem icon={<FaFileAlt />} text="GENERATE REPORT" to="/report" />
          <MenuItem icon={<FaRegFileAlt />} text="adminDasboard" to="/admin" />
      </nav>

      <div className="p-5 text-center">
        <button onClick={onLogout} className="flex items-center justify-center bg-transparent text-white border-none cursor-pointer text-sm py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors">
          <FaSignOutAlt className="mr-2" /> LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Sidebar;