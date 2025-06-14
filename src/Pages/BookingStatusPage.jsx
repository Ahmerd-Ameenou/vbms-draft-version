import Sidebar from '../Components/Layout/layout/Sidebar';

const BookingStatusPage = () => {
  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      <Sidebar 
        onLogout={() => {
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }} 
      />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col items-center">
            {/* Status Icon with Animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-orange-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Status</h2>
            
            {/* Status Indicator */}
            <div className="mb-6 px-4 py-2 bg-orange-50 rounded-full">
              <span className="text-orange-600 font-medium">Pending Approval</span>
            </div>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              Your booking request has been submitted successfully and is under review.
              We'll notify you once it's approved.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-orange-500 h-2 rounded-full animate-pulse" 
                style={{ width: '60%' }}
              ></div>
            </div>

            {/* Action Button */}
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusPage;