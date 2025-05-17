import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Correct imports matching your structure
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import AvailableVenuesPage from './Pages/AvailableVenuePage';
import VenuesListPage from './Pages/VenuesListPage';
import BookVenuePage from './Pages/BookVenuepage';
import ItemsReturnPage from './Pages/ItemsReturnPage';
import BookingStatusPage from './Pages/BookingStatusPage';
import ReportPage from './Pages/ReportPage';
import AdminDashboard from './Pages/AdminDashboard'; // Fixed typo in filename
import RegistrationPage from './Pages/RegistrationPage';


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
