import axios from 'axios';
import type { PatientProfile, CreatePatientProfileDTO, UpdatePatientProfileDTO } from '../types/patient.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009/api';

export const patientProfileService = {
  createProfile: async (data: CreatePatientProfileDTO, token: string) => {
    const response = await axios.post(
      `${API_URL}/patient-profiles/by-custom-id`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getProfileByCustomUserId: async (customUserId: string, token: string) => {
    const response = await axios.get(
      `${API_URL}/patient-profiles/by-custom-id/${customUserId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getMyProfile: async (token: string) => {
    const response = await axios.get(`${API_URL}/patient-profiles/my-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateProfile: async (customUserId: string, data: UpdatePatientProfileDTO, token: string) => {
    const response = await axios.put(
      `${API_URL}/patient-profiles/by-custom-id/${customUserId}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  deleteProfile: async (customUserId: string, token: string) => {
    const response = await axios.delete(
      `${API_URL}/patient-profiles/by-custom-id/${customUserId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getAllProfiles: async (token: string) => {
    const response = await axios.get(`${API_URL}/patient-profiles/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};