import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PatientSignup } from './pages/PatientSignup';
import { Login } from './pages/Login';
import { ManageStaff } from './pages/admin/ManageStaff';
import { ManageResourceAllocation } from './pages/ManageResourceAllocation';
import AppointmentManagement from './pages/AppointmentManagement';

import { ManagePatientProfile } from './pages/patient/ManagePatientProfile';
import { PatientMedicalRecords } from './pages/patient/PatientMedicalRecords';
import { PatientDashboard } from './pages/patient/PatientDashboard';

function App() {
  return (
    <div className="min-h-screen overflow-hidden">
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<PatientSignup />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin/staff" element={<ManageStaff />} />

          {/* Patient Profile Management (Doctor/Nurse/Admin) */}
          <Route path="/patient/profile" element={<ManagePatientProfile />} />
          <Route path="/patient/medical-records/:customUserId" element={<PatientMedicalRecords />} />

          {/* Patient Dashboard */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />

          {/* Other Routes */}
          <Route path="/resources/*" element={<ManageResourceAllocation />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path='/appointment/*' element={<AppointmentManagement/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </div>
  );
}

export default App;