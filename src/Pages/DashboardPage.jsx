import { FaUsers, FaCalendarAlt, FaQuestionCircle, FaBoxOpen, FaUserCircle, FaUndoAlt, FaDoorOpen, FaMapMarkerAlt, FaRegBuilding } from 'react-icons/fa';
import Sidebar from '../Components/Layout/layout/Sidebar';
import SquareButton from '../Components/Layout/layout/SquareButton';
import { FaBookBookmark } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { supabase } from '../Supabase-client';

const DashboardPage = () => {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch user profile data
          const { data: profileData, error } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          // Extract first name from full_name
          const name = profileData?.full_name || user.email || 'User';
          const first = name.split(' ')[0]; // Get first part of name
          setFirstName(first);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setFirstName('User');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }} />

      {/* Main Content Area with Enhanced Border */}
      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto">
        {/* Modern Border Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-tl-3xl rounded-bl-3xl">
          {/* Border Gradient Layer */}
          <div className="absolute inset-0 border-l-[12px] border-t-[12px] border-b-[12px] border-transparent 
            bg-gradient-to-br from-[#1a2552]/10 via-[#0ba9a9]/10 to-[#83c059]/10 
            rounded-tl-3xl rounded-bl-3xl p-[2px]">
            {/* Inner Glow Effect */}
            <div className="absolute inset-0 rounded-tl-3xl rounded-bl-3xl 
              shadow-[inset_0_0_20px_0_rgba(11,169,169,0.3)] pointer-events-none"></div>
          </div>
          
          {/* Main Content */}
          <div className="absolute inset-0 bg-white rounded-tl-3xl rounded-bl-3xl ml-[10px] mt-[10px] mb-[10px] 
            border-l-[1px] border-t-[1px] border-b-[1px] border-[#0ba9a9]/20">
            <div className="flex-1 bg-white p-0 flex flex-col items-center h-full overflow-y-auto">
              {/* Modern Welcome Title */}
              <div className="w-full max-w-5xl px-6 mt-8 mb-6">
                <h1 className="text-4xl font-bold text-gray-800">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dashboard</span>
                </h1>
                <p className="font-bold text-black mt-2 text-lg">
                  {firstName ? `Hello, ${firstName}!` : 'Loading...'}
                </p>
                <p className="italic text-gray-500 mt-1 text-lg">
                  Effortlessly reserve and manage your campus venues!
                </p>
              </div>

              <div className="flex gap-8 justify-center w-full max-w-5xl flex-wrap mt-4 pb-8">
                <SquareButton icon={<FaUserCircle />} text="USER PROFILE" to="/user-profile" />
                <SquareButton 
                  icon={<FaDoorOpen />} 
                  text="BOOK VENUES" 
                  to="/venues" 
                />
                <SquareButton icon={<FaQuestionCircle />} text="REQUEST BOOKING STATUS" to="/booking-status" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;