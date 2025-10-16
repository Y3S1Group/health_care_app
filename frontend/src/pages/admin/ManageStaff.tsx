import React from 'react';
import { Navigate } from 'react-router-dom';
import { CreateStaffForm } from '../../components/auth/CreateStaffForm';
import { useAuth } from '../../context/AuthContext';

export const ManageStaff: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Staff Management</h1>
        <CreateStaffForm />
      </div>
    </div>
  );
};