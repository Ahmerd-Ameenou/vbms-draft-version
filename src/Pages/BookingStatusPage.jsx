import Sidebar from '../Components/Layout/layout/Sidebar';

const BookingStatusPage = () => {
  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }} />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <div className="max-w-xl mx-auto my-20 p-10 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Status</h2>
          <div className="text-xl my-5 text-gray-800">
            Current Status: <span className="text-orange-500">Pending Approval</span>
          </div>
          <p className="text-gray-600">
            Your booking request has been submitted successfully and is under review.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusPage;