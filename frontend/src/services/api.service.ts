import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { 
  ApiResponse, 
  AllocationFormData,
  PatientFlowResponse,
  DepartmentUtilizationResponse,
  ShortageResponse,
  SuggestionResponse,
  AllocationResponse,
  StaffResource,
  AllocationData
} from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`${response.config.url}`, response.data);
        return response;
      },
      (error: AxiosError) => {
        console.error('API Error:', error.response?.data || error.message);
        const errorMessage = (error.response?.data as any)?.error?.message
          || error.message
          || 'An unexpected error occurred';
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const response = await this.client.request<ApiResponse<T>>({
      method,
      url,
      data
    });
    return response.data;
  }

  // UC04 Endpoints with proper typing
  async getDashboard(managerID: string): Promise<ApiResponse<any>> {
    return this.request<any>('GET', `/resources/dashboard/${managerID}`);
  }

  async getPatientFlowAnalysis(managerID: string): Promise<ApiResponse<PatientFlowResponse>> {
    return this.request<PatientFlowResponse>('GET', `/resources/patient-flow/${managerID}`);
  }

  async getDepartmentUtilization(managerID: string): Promise<ApiResponse<DepartmentUtilizationResponse>> {
    return this.request<DepartmentUtilizationResponse>('GET', `/resources/utilization/${managerID}`);
  }

  async detectShortages(managerID: string): Promise<ApiResponse<ShortageResponse>> {
    return this.request<ShortageResponse>('GET', `/resources/shortages/${managerID}`);
  }

  async getSuggestedReallocation(managerID: string): Promise<ApiResponse<SuggestionResponse>> {
    return this.request<SuggestionResponse>('GET', `/resources/suggestions/${managerID}`);
  }

  async allocateResources(managerID: string, data: AllocationFormData): Promise<ApiResponse<AllocationResponse>> {
    return this.request<AllocationResponse>('POST', `/resources/allocate/${managerID}`, data);
  }

  async getAllAllocations(): Promise<ApiResponse<AllocationData[]>> {
    return this.request<AllocationData[]>('GET', '/resources/allocations');
  }

  // Staff endpoints
  async getStaffResources(department?: string): Promise<ApiResponse<StaffResource[]>> {
    const url = department ? `/staff?department=${department}` : '/staff';
    return this.request<StaffResource[]>('GET', url);
  }

  async getHospitals(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('GET', '/hospitals');
  }

  async getAvailableStaff(department: string): Promise<ApiResponse<StaffResource[]>> {
    return this.request<StaffResource[]>('GET', `/staff/available/${department}`);
  }
}

export const apiService = new ApiService();