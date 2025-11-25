export type PatientStatus = "new" | "active" | "vip" | "archived";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: "male" | "female" | "other" | null;
  phone: string | null;
  email: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressZip: string | null;
  addressCountry: string | null;
  photoUrl: string | null;
  status: PatientStatus;
  tags: string[];
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientListResponse {
  data: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PatientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PatientStatus;
  sortBy?: "firstName" | "lastName" | "createdAt" | "dateOfBirth";
  sortOrder?: "ASC" | "DESC";
}
