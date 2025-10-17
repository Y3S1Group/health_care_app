import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PatientProfileView } from '../../components/patient/PatientProfileView';
import { useAuth } from '../../context/AuthContext';
import { patientProfileService } from '../../services/patientProfile.service';
import type { PatientProfile } from '../../types/patient.types';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'patient') {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const fetchDashboardData = async () => {
    if (!token || !user) return;

    setLoading(true);
    try {
      // Fetch patient's own profile
      const profileRes = await patientProfileService.getMyProfile(token);
      setProfile(profileRes.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No profile found. Please contact your healthcare provider.');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/login')}>Back to Login</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with User Info and Logout */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Health Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          
          {/* User Info and Logout Button */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Patient ID: {user?.userId}</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Patient Info Card */}
        <Card title="Patient Information" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Patient ID</p>
              <p className="text-lg font-semibold text-gray-900">{user?.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
            </div>
          </div>
        </Card>

        {/* Profile Section */}
        {profile && (
          <div className="mb-8">
            <PatientProfileView profile={profile} />
          </div>
        )}

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate(`/patient/medical-records/${user?.userId}`)}
              className="w-full"
            >
              View Full Medical Records
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/appointments')}
              className="w-full"
            >
              Book Appointment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};