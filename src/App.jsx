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
import AdminLogin from './Pages/AdminLogin';
import LandingPage from './Pages/LandingPage';

// Protected Route Component
const ProtectedRoute = ({ children, adminRoute = false }) => {
  const location = useLocation();
  
  // Combined auth check
  const isAuth = localStorage.getItem('isAuthenticated') === 'true' || 
                localStorage.getItem('isAdminAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdminAuthenticated') === 'true';

  if (!isAuth) {
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to={adminRoute ? "/admin/login" : "/login"} replace />;
  }

  // Allow access if:
  // - User accesses user route AND is regular user
  // - Admin accesses admin route AND is admin
  if ((adminRoute && isAdmin) || (!adminRoute && !isAdmin)) {
    return children;
  }

  // Redirect to proper dashboard if role mismatch
  return <Navigate to={isAdmin ? "/admin-dashboard" : "/dashboard"} replace />;
};

// Auth Cleanup Component
const AuthCleanup = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/admin/login') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('userRole');
    }
  }, [location.pathname]);

  return null;
};

// Initial Redirect Component
const InitialRedirect = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/') {
      window.history.replaceState(null, '', '/login');
    }
  }, [location]);

  return null;
};

// Main App Component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize auth state
    setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    setIsAdminAuthenticated(localStorage.getItem('isAdminAuthenticated') === 'true');
    localStorage.removeItem('redirectPath');
  }, []);

  return (
    <Router>
      <AuthCleanup />
      <InitialRedirect />
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            localStorage.getItem('isAuthenticated') === 'true' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={() => {
                localStorage.setItem('isAuthenticated', 'true');
                setIsAuthenticated(true);
                localStorage.removeItem('isAdminAuthenticated');
                setIsAdminAuthenticated(false);
              }} />
            )
          }
        />

        {/* Admin Login Route */}
        <Route
          path="/admin/login"
          element={
            localStorage.getItem('isAdminAuthenticated') === 'true' ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <AdminLogin onAdminLogin={() => {
                localStorage.setItem('isAdminAuthenticated', 'true');
                setIsAdminAuthenticated(true);
                localStorage.removeItem('isAuthenticated');
                setIsAuthenticated(false);
              }} />
            )
          }
        />

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute adminRoute={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute adminRoute={true}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booked-venues"
          element={
            <ProtectedRoute adminRoute={true}>
              <BookedVenuesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/approve-reject-bookings"
          element={
            <ProtectedRoute adminRoute={true}>
              <ApproveRejectBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute adminRoute={true}>
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/available-venues"
          element={
            <ProtectedRoute>
              <AvailableVenuesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/venues"
          element={
            <ProtectedRoute>
              <VenuesListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:venue"
          element={
            <ProtectedRoute>
              <BookVenuePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/items-return"
          element={
            <ProtectedRoute>
              <ItemsReturnPage />
            </ProtectedRoute>
          }
        />

        {/* REPORT PAGE ROUTE - Now properly protected */}
        // To just this:
        {/* Report Route - Modified to bypass strict role check */}
{/* Admin-only Report Route */}
          
<Route
  path="/report"
  element={
    localStorage.getItem('isAdminAuthenticated') === 'true' ? (
      <ReportPage />
    ) : (
      <Navigate to={
        localStorage.getItem('isAuthenticated') === 'true' 
          ? '/admin-dashboard'  // Redirect admins to admin dashboard
          : '/admin/login'      // Redirect others to admin login
      } replace />
    )
  }
/>



        <Route
          path="/booking-status"
          element={
            <ProtectedRoute>
              <BookingStatusPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Route */}
        <Route 
          path="*" 
          element={
            <Navigate to={
              isAdminAuthenticated ? '/admin-dashboard' : 
              isAuthenticated ? '/dashboard' : '/login'
            } replace />
          } 
        />
      </Routes>
    </Router>
  );
}