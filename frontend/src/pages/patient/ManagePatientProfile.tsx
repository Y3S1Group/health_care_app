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

// Header Component with Scan Health Card active
const Header: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-3.25-.94-6-4.27-6-8.5V8.3l6-3.11v15.31z"/>
                                <path d="M13 8h-2v4H7v2h4v4h2v-4h4v-2h-4V8z"/>
                            </svg>
                        </div>
                        <h1 className="text-base sm:text-lg font-semibold text-gray-800">Health Care System</h1>
                    </div>
                    
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-12">
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Home</a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                            Manage Resource Allocation
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Appointments</a>
                        <a href="#" className="text-sm font-semibold text-gray-900 border-b-2 border-blue-600 pb-1">
                            Scan Health Card
                        </a>
                    </nav>

                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Footer Component
const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-4 sm:space-x-6 text-xs text-gray-500">
                        <span>© 2024 Health Care System. All rights reserved.</span>
                        <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900">Terms of Service</a>
                        <a href="#" className="hover:text-gray-900">Contact Support</a>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Emergency: 119</span>
                        <button className="p-1 hover:bg-gray-100 rounded" aria-label="Call">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" aria-label="Email">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" aria-label="Chat">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Main Page Component
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow py-8">
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
        <Footer />
      </div>
    </div>
  );
};