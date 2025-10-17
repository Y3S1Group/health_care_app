import axios from 'axios';
import type { Prescription, CreatePrescriptionDTO, UpdatePrescriptionDTO } from '../types/patient.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009/api';

export const prescriptionService = {
  createPrescription: async (data: CreatePrescriptionDTO, token: string) => {
    const response = await axios.post(
      `${API_URL}/prescriptions/by-custom-id`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getPrescriptionsByCustomUserId: async (customUserId: string, token: string) => {
    const response = await axios.get(
      `${API_URL}/prescriptions/by-custom-id/${customUserId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getActivePrescriptionsByCustomUserId: async (customUserId: string, token: string) => {
    const response = await axios.get(
      `${API_URL}/prescriptions/by-custom-id/${customUserId}/active`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getPrescriptionById: async (id: string, token: string) => {
    const response = await axios.get(`${API_URL}/prescriptions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updatePrescription: async (id: string, data: UpdatePrescriptionDTO, token: string) => {
    const response = await axios.put(
      `${API_URL}/prescriptions/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  deletePrescription: async (id: string, token: string) => {
    const response = await axios.delete(`${API_URL}/prescriptions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};