import axios from 'axios';
import type { SignupData, LoginData, AuthResponse } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009/api';

export const authService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  },

  getProfile: async (token: string) => {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};