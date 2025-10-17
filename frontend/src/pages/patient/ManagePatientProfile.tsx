import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { PatientProfileForm } from '../../components/patient/PatientProfileForm';
import { PatientProfileView } from '../../components/patient/PatientProfileView';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { patientProfileService } from '../../services/patientProfile.service';
import type { PatientProfile } from '../../types/patient.types';

export const ManagePatientProfile: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, logout, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [customUserId, setCustomUserId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleSearch = async () => {
    if (!customUserId.trim()) {
      setSearchError('Please enter a Patient ID');
      return;
    }

    setLoading(true);
    setSearchError('');
    setProfile(null);

    try {
      const response = await patientProfileService.getProfileByCustomUserId(
        customUserId,
        token!
      );
      setProfile(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSearchError('Patient profile not found');
      } else {
        setSearchError(err.response?.data?.message || 'Failed to fetch profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const response = await patientProfileService.createProfile(data, token!);
      setProfile(response.data);
      setIsCreateModalOpen(false);
      setCustomUserId(data.userId);
    } catch (err: any) {
      throw err;
    }
  };

  const handleUpdate = async (data: any) => {
    if (!profile) return;

    try {
      const response = await patientProfileService.updateProfile(
        customUserId,
        data,
        token!
      );
      setProfile(response.data);
      setIsEditModalOpen(false);
    } catch (err: any) {
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!profile || !window.confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    try {
      await patientProfileService.deleteProfile(customUserId, token!);
      setProfile(null);
      setCustomUserId('');
      alert('Profile deleted successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with User Info and Logout */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Patient Profile</h1>
            <p className="text-gray-600 mt-2">
              Search for a patient by their ID to view or manage their profile
            </p>
          </div>
          
          {/* User Info and Logout Button */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <Card title="Search Patient">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter Patient ID (e.g., PAT-202510-0001)"
                value={customUserId}
                onChange={(e) => {
                  setCustomUserId(e.target.value);
                  setSearchError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              {searchError && (
                <p className="text-red-500 text-sm mt-1">{searchError}</p>
              )}
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(true)}>
              Create New Profile
            </Button>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="mt-8">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Profile Display */}
        {profile && !loading && (
          <div className="mt-8 space-y-6">
            <Card
              title="Patient Information"
              actions={
                <>
                  <Button onClick={() => setIsEditModalOpen(true)}>
                    Edit Profile
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete Profile
                  </Button>
                </>
              }
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Patient ID</p>
                  <p className="text-lg font-semibold text-gray-900">{customUserId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profile Created</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            <PatientProfileView profile={profile} />

            <div className="flex gap-4">
              <Button
                onClick={() => navigate(`/patient/medical-records/${customUserId}`)}
                className="flex-1"
              >
                View Medical Records
              </Button>
            </div>
          </div>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Patient Profile"
          size="xl"
        >
          <PatientProfileForm
            customUserId={customUserId}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Patient Profile"
          size="xl"
        >
          {profile && (
            <PatientProfileForm
              profile={profile}
              customUserId={customUserId}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditModalOpen(false)}
              isEdit
            />
          )}
        </Modal>
      </div>
    </div>
  );
};