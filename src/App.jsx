import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Correct imports matching your structure
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import AvailableVenuesPage from './Pages/AvailableVenuesPage';
import VenuesListPage from './Pages/VenuesListPage';
import BookVenuePage from './Pages/BookVenuepage';
import ItemsReturnPage from './Pages/ItemsReturnPage';
import BookingStatusPage from './Pages/BookingStatusPage';
import ReportPage from './Pages/ReportPage';
import AdminDashboard from './Pages/AdminDashboard'; // Corrected file name
import RegistrationPage from './Pages/RegistrationPage';
import UsersPage from './Pages/UsersPage'; // Adjust the path as necessary
import BookedVenuesPage from './Pages/BookedVenuesPage';  // Adjust the path
import ApproveRejectBookings from './Pages/ApproveRejectBookings';  // Adjust the path accordingly
import UserProfilePage from './Pages/UserProfilePage';
import InventoryPage from './Pages/InventoryPage';  








const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegistrationPage />} />


        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<AdminDashboard />} />
        
        <Route path="/users" element={<UsersPage />} />

        <Route path="/booked-venues" element={<BookedVenuesPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/inventory" element={<InventoryPage />} />

        
<Route path="/approve-reject-bookings" element={<ApproveRejectBookings />} />


        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/available-venues"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AvailableVenuesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/venues"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <VenuesListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:venue"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BookVenuePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/items-return"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ItemsReturnPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking-status"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BookingStatusPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
