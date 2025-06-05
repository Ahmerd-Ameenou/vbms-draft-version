import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import all your pages
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import AvailableVenuesPage from './Pages/AvailableVenuesPage';
import VenuesListPage from './Pages/VenuesListPage';
import BookVenuePage from './Pages/BookVenuepage';
import ItemsReturnPage from './Pages/ItemsReturnPage';
import BookingStatusPage from './Pages/BookingStatusPage';
import ReportPage from './Pages/ReportPage';
import AdminDashboard from './Pages/AdminDashboard';
import RegistrationPage from './Pages/RegistrationPage';
import UsersPage from './Pages/UsersPage';
import BookedVenuesPage from './Pages/BookedVenuesPage';
import ApproveRejectBookings from './Pages/ApproveRejectBookings';
import UserProfilePage from './Pages/UserProfilePage';
import InventoryPage from './Pages/InventoryPage';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    // Store attempted path for redirect after login
    localStorage.setItem('redirectPath', window.location.pathname);
    return <Navigate to="/login" replace />;
  }
  return children;
};

const InitialRedirect = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/') {
      window.history.replaceState(null, '', '/login');
    }
  }, [location]);

  return null;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Clear redirect path on mount
  useEffect(() => {
    localStorage.removeItem('redirectPath');
  }, []);

  return (
    <Router>
      <InitialRedirect />
      <Routes>
        {/* Login Route with redirect back to original path */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={localStorage.getItem('redirectPath') || '/dashboard'} replace />
            ) : (
              <LoginPage onLogin={() => {
                localStorage.setItem('isAuthenticated', 'true');
                setIsAuthenticated(true);
              }} />
            )
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booked-venues"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BookedVenuesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/approve-reject-bookings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ApproveRejectBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
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

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
          } 
        />
      </Routes>
    </Router>
  );
}