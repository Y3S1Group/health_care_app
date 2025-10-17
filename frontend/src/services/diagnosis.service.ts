import axios from 'axios';
import type { Diagnosis, CreateDiagnosisDTO, UpdateDiagnosisDTO } from '../types/patient.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009/api';

export const diagnosisService = {
  createDiagnosis: async (data: CreateDiagnosisDTO, token: string) => {
    const response = await axios.post(
      `${API_URL}/diagnoses/by-custom-id`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getDiagnosesByCustomUserId: async (customUserId: string, token: string) => {
    const response = await axios.get(
      `${API_URL}/diagnoses/by-custom-id/${customUserId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getDiagnosisById: async (id: string, token: string) => {
    const response = await axios.get(`${API_URL}/diagnoses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateDiagnosis: async (id: string, data: UpdateDiagnosisDTO, token: string) => {
    const response = await axios.put(
      `${API_URL}/diagnoses/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  deleteDiagnosis: async (id: string, token: string) => {
    const response = await axios.delete(`${API_URL}/diagnoses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};