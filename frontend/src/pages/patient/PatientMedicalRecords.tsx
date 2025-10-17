import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { DiagnosisForm } from '../../components/patient/DiagnosisForm';
import { DiagnosisList } from '../../components/patient/DiagnosisList';
import { PrescriptionForm } from '../../components/patient/PrescriptionForm';
import { PrescriptionList } from '../../components/patient/PrescriptionList';
import { useAuth } from '../../context/AuthContext';
import { diagnosisService } from '../../services/diagnosis.service';
import { prescriptionService } from '../../services/prescription.service';
import type { Diagnosis, Prescription } from '../../types/patient.types';

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

export const PatientMedicalRecords: React.FC = () => {
  const navigate = useNavigate();
  const { customUserId } = useParams<{ customUserId: string }>();
  const { token, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isAddDiagnosisModalOpen, setIsAddDiagnosisModalOpen] = useState(false);
  const [isAddPrescriptionModalOpen, setIsAddPrescriptionModalOpen] = useState(false);

  const canEdit = user?.role === 'doctor' || user?.role === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (customUserId) {
      fetchMedicalRecords();
    }
  }, [customUserId, isAuthenticated]);

  const fetchMedicalRecords = async () => {
    if (!customUserId || !token) return;

    setLoading(true);
    try {
      const [diagnosisRes, prescriptionRes] = await Promise.all([
        diagnosisService.getDiagnosesByCustomUserId(customUserId, token),
        prescriptionService.getPrescriptionsByCustomUserId(customUserId, token),
      ]);

      setDiagnoses(diagnosisRes.data);
      setPrescriptions(prescriptionRes.data);
    } catch (err: any) {
      console.error('Failed to fetch medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  // Diagnosis handlers
  const handleCreateDiagnosis = async (data: any) => {
    try {
      await diagnosisService.createDiagnosis(data, token!);
      await fetchMedicalRecords();
      setIsAddDiagnosisModalOpen(false);
    } catch (err: any) {
      console.error('Failed to create diagnosis:', err);
      throw err;
    }
  };

  const handleUpdateDiagnosis = async (id: string, data: any) => {
    try {
      await diagnosisService.updateDiagnosis(id, data, token!);
      await fetchMedicalRecords();
    } catch (err: any) {
      console.error('Failed to update diagnosis:', err);
      throw err;
    }
  };

  const handleDeleteDiagnosis = async (id: string) => {
    try {
      await diagnosisService.deleteDiagnosis(id, token!);
      await fetchMedicalRecords();
    } catch (err: any) {
      console.error('Failed to delete diagnosis:', err);
      alert('Failed to delete diagnosis');
    }
  };

  // Prescription handlers
  const handleCreatePrescription = async (data: any) => {
    try {
      await prescriptionService.createPrescription(data, token!);
      await fetchMedicalRecords();
      setIsAddPrescriptionModalOpen(false);
    } catch (err: any) {
      console.error('Failed to create prescription:', err);
      throw err;
    }
  };

  const handleUpdatePrescription = async (id: string, data: any) => {
    try {
      await prescriptionService.updatePrescription(id, data, token!);
      await fetchMedicalRecords();
    } catch (err: any) {
      console.error('Failed to update prescription:', err);
      throw err;
    }
  };

  const handleDeletePrescription = async (id: string) => {
    try {
      await prescriptionService.deletePrescription(id, token!);
      await fetchMedicalRecords();
    } catch (err: any) {
      console.error('Failed to delete prescription:', err);
      alert('Failed to delete prescription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
              <p className="text-gray-600 mt-2">Patient ID: {customUserId}</p>
            </div>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back to Profile
            </Button>
          </div>

          {/* Action Buttons */}
          {canEdit ? (
            <div className="mb-6 flex gap-4">
              <Button 
                onClick={() => {
                  console.log('Add Diagnosis clicked');
                  setIsAddDiagnosisModalOpen(true);
                }}
              >
                Add Diagnosis
              </Button>
              <Button 
                onClick={() => {
                  console.log('Add Prescription clicked');
                  setIsAddPrescriptionModalOpen(true);
                }}
              >
                Add Prescription
              </Button>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              You don't have permission to add diagnoses or prescriptions. Only doctors and admins can add records.
            </div>
          )}

          {/* Diagnoses Section */}
          <div className="mb-8">
            <DiagnosisList
              diagnoses={diagnoses}
              onUpdate={handleUpdateDiagnosis}
              onDelete={handleDeleteDiagnosis}
              canEdit={canEdit}
            />
          </div>

          {/* Prescriptions Section */}
          <div>
            <PrescriptionList
              prescriptions={prescriptions}
              onUpdate={handleUpdatePrescription}
              onDelete={handleDeletePrescription}
              canEdit={canEdit}
            />
          </div>

          {/* Add Diagnosis Modal */}
          <Modal
            isOpen={isAddDiagnosisModalOpen}
            onClose={() => {
              console.log('Closing diagnosis modal');
              setIsAddDiagnosisModalOpen(false);
            }}
            title="Add Diagnosis"
          >
            <DiagnosisForm
              customUserId={customUserId}
              onSubmit={handleCreateDiagnosis}
              onCancel={() => setIsAddDiagnosisModalOpen(false)}
            />
          </Modal>

          {/* Add Prescription Modal */}
          <Modal
            isOpen={isAddPrescriptionModalOpen}
            onClose={() => {
              console.log('Closing prescription modal');
              setIsAddPrescriptionModalOpen(false);
            }}
            title="Add Prescription"
          >
            <PrescriptionForm
              customUserId={customUserId}
              onSubmit={handleCreatePrescription}
              onCancel={() => setIsAddPrescriptionModalOpen(false)}
            />
          </Modal>
        </div>
      </div>
      <Footer />
    </div>
  );
};