import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from './Login';
import { DashboardScreen } from '../components/DashboardScreen';
import { BookAppointmentScreen } from '../components/BookAppointmentScreen';
import { ConfirmPaymentScreen } from '../components/ConfirmPaymentScreen';
import { NotificationsScreen } from '../components/NotificationsScreen';
import { RescheduleScreen } from '../components/RescheduleScreen';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Component to check authentication before rendering
 * SOLID: Single Responsibility - Only handles auth checking
 */
interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user } = useAuth(); // adjust to your context shape
  return user ? element : <Navigate to="/login" replace />;
};

/**
 * AppointmentManagement - UC04 Routes
 * Routes are nested under /appointment path from App.tsx
 * SOLID: Single Responsibility - Route management only
 */
const AppointmentManagement: React.FC = () => {
  return (
    <Routes>
      {/* Public route - Login */}
      <Route path="login" element={<Login />} />

      {/* Protected routes - Dashboard */}
      <Route
        path="dashboard"
        element={<ProtectedRoute element={<DashboardScreen />} />}
      />

      {/* Protected routes - Book Appointment */}
      <Route
        path="book-appointment"
        element={<ProtectedRoute element={<BookAppointmentScreen />} />}
      />

      {/* Protected routes - Appointment Confirmation */}
      <Route
        path="appointment-confirmation"
        element={<ProtectedRoute element={<ConfirmPaymentScreen />} />}
      />

      {/* Protected routes - Notifications */}
      <Route
        path="notifications"
        element={<ProtectedRoute element={<NotificationsScreen />} />}
      />

      {/* Protected routes - Reschedule */}
      <Route
        path="reschedule"
        element={<ProtectedRoute element={<RescheduleScreen />} />}
      />

      {/* Default route - redirect based on authentication */}
      <Route
        path=""
        element={
          !!localStorage.getItem('user') ? (
            <Navigate to="dashboard" replace />
          ) : (
            <Navigate to="login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppointmentManagement;