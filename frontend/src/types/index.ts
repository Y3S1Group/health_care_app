export enum StaffStatus {
  AVAILABLE = 'Available',
  ON_BREAK = 'On Break',
  UNAVAILABLE = 'Unavailable'
}
export enum BedStatus {
  OCCUPIED = 'Occupied',
  AVAILABLE = 'Available',
  MAINTENANCE = 'Maintenance'
}
export enum EquipmentStatus {
  OPERATIONAL = 'Operational',
  IN_USE = 'In Use',
  MAINTENANCE = 'Maintenance'
}

export interface StaffResource {
    staffID: string;
    name: string;
    role: string;
    department: string;
    shift: string;
    availability: string;
    status: 'Available' | 'On Break' | 'Unavailable';
}

export interface BedResource {
    bedID: string;
    room: string;
    department: string;
    type: string;
    currentPatient: string;
    status: 'Occupied' | 'Available' | 'Maintenance';
}

export interface EquipmentResource {
    equipmentID: string;
    name: string;
    department: string;
    type: string;
    availability: string;
    status: 'Operational' | 'In Use' | 'Maintenance';
}

export interface ResourceSummary {
    staff: {
        available: number;
        total: number;
    };
    beds: {
        available: number;
        total: number;
    };
    equipment: {
        available: number;
        total: number;
    };
}

export interface AllocationPlan {
    allocationID?: string;
    department: string;
    shift: string;
    nursesRequired: number;
    doctorsRequired: number;
    nursesCurrently: number;
    doctorsCurrently: number;
    status?: 'Understaffed' | 'Optimal' | 'Review Needed';
}

export interface PatientFlowData {
    department: string;
    currentStaff: number;
    currentBeds: number;
    flowStatus: 'HIGH' | 'NORMAL' | 'LOW';
}

export interface DepartmentUtilization {
    department: string;
    totalBeds: number;
    allocatedBeds: number;
    availableBeds: number;
    utilizationRate: number;
    status: 'CRITICAL' | 'HIGH' | 'NORMAL';
}

export interface AllocationFormData {
  department: string;
  shift: string;
  nursesRequired?: number;
  doctorsRequired?: number;
  hospitalID: string;
  staffIds: string[];
  bedCount: number;
  equipment: string[];
}
export interface AllocationData {
  allocationID: string;
  managerID: string;
  hospitalID: string;
  department: string;
  staffIds: string[];
  bedCount: number;
  equipment: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PatientFlowResponse {
  flowAnalysis: PatientFlowData[];
}
export interface DepartmentUtilizationResponse {
  utilization: DepartmentUtilization[];
}
export interface ShortageResponse {
  hasShortages: boolean;
  shortageCount: number;
  shortages: Array<{
    department: string;
    message: string;
    severity: string;
  }>;
}
export interface SuggestionResponse {
  suggestions: Array<{
    from: string;
    to: string;
    resourceType: string;
    quantity: number;
    priority: string;
  }>;
}
export interface AllocationResponse {
  allocation: AllocationData;
  audit: {
    actorId: string;
    action: string;
    target: string;
  };
  notifications: string[];
}
export interface StaffResponse {
  staff?: StaffResource[];
  // Backend might return array directly or wrapped in object
}
export interface HospitalResponse {
  hospitals?: any[];
  // Backend might return array directly or wrapped in object
}
export interface AllocationsResponse {
  allocations?: AllocationData[];
  // Backend might return array directly or wrapped in object
}
