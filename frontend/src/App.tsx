import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PatientSignup } from './pages/PatientSignup';
import { Login } from './pages/Login';
import { ManageStaff } from './pages/admin/ManageStaff';
import { ManageResourceAllocation } from './pages/ManageResourceAllocation';
import AppointmentManagement from './pages/AppointmentManagement';

const App: React.FC = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<PatientSignup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/staff" element={<ManageStaff />} />
            <Route path="/resources" element={<ManageResourceAllocation />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path='/appointment/*' element={<AppointmentManagement/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
