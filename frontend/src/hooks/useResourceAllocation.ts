import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api.service';
import type { 
  PatientFlowData, 
  DepartmentUtilization, 
  AllocationFormData, 
  StaffResource, 
  AllocationData,
  AllocationResponse,
  ShortageResponse
} from '../types';

interface UseResourceAllocationReturn {
  loading: boolean;
  error: string | null;
  patientFlow: PatientFlowData[];
  utilization: DepartmentUtilization[];
  shortages: any[];
  suggestions: any[];
  staffResources: StaffResource[];
  allocations: AllocationData[];
  hospitals: any[];
  
  fetchPatientFlow: () => Promise<void>;
  fetchUtilization: () => Promise<void>;
  detectShortages: () => Promise<ShortageResponse>;
  fetchSuggestions: () => Promise<void>;
  allocateResources: (data: AllocationFormData) => Promise<AllocationResponse>;
  fetchStaffResources: (department?: string) => Promise<void>;
  fetchAllocations: () => Promise<void>;
  fetchHospitals: () => Promise<void>;
  clearError: () => void;
}

export const useResourceAllocation = (managerID: string): UseResourceAllocationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientFlow, setPatientFlow] = useState<PatientFlowData[]>([]);
  const [utilization, setUtilization] = useState<DepartmentUtilization[]>([]);
  const [shortages, setShortages] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [staffResources, setStaffResources] = useState<StaffResource[]>([]);
  const [allocations, setAllocations] = useState<AllocationData[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchPatientFlow = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getPatientFlowAnalysis(managerID);
      
      if (isMountedRef.current) {
        setPatientFlow(response.data.flowAnalysis || []);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [managerID]);

  const fetchUtilization = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getDepartmentUtilization(managerID);
      
      if (isMountedRef.current) {
        setUtilization(response.data.utilization || []);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [managerID]);

  const detectShortages = useCallback(async (): Promise<ShortageResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.detectShortages(managerID);
      
      if (isMountedRef.current) {
        setShortages(response.data.shortages || []);
      }
      
      return response.data;
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [managerID]);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getSuggestedReallocation(managerID);
      
      if (isMountedRef.current) {
        setSuggestions(response.data.suggestions || []);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [managerID]);

  const allocateResources = useCallback(async (data: AllocationFormData): Promise<AllocationResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.allocateResources(managerID, data);
      
      await Promise.all([
        fetchPatientFlow(),
        fetchUtilization(),
        fetchStaffResources(),
        fetchAllocations()
      ]);
      
      return response.data;
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [managerID]);

  const fetchStaffResources = useCallback(async (department?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getStaffResources(department);
      
      if (isMountedRef.current) {
        // Handle both array response or wrapped response
        const staffData = Array.isArray(response.data) ? response.data : [];
        setStaffResources(staffData);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
        setStaffResources([]); // Set empty array on error
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const fetchAllocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAllAllocations();
      
      if (isMountedRef.current) {
        const allocationsData = Array.isArray(response.data) ? response.data : [];
        setAllocations(allocationsData);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
        setAllocations([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getHospitals();
      
      if (isMountedRef.current) {
        const hospitalsData = Array.isArray(response.data) ? response.data : [];
        setHospitals(hospitalsData);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
        setHospitals([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchPatientFlow();
    fetchUtilization();
    fetchStaffResources();
    fetchAllocations();
    fetchHospitals();
  }, [fetchPatientFlow, fetchUtilization, fetchStaffResources, fetchAllocations, fetchHospitals]);

  return {
    loading,
    error,
    patientFlow,
    utilization,
    shortages,
    suggestions,
    staffResources,
    allocations,
    hospitals,
    fetchPatientFlow,
    fetchUtilization,
    detectShortages,
    fetchSuggestions,
    allocateResources,
    fetchStaffResources,
    fetchAllocations,
    fetchHospitals,
    clearError
  };
};