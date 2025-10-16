import React from 'react';
import { PatientSignupForm } from '../components/auth/PatientSignupForm';

export const PatientSignup: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <PatientSignupForm />
      </div>
    </div>
  );
};