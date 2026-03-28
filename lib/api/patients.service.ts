import { httpClient } from "@/lib/api/http-client";
import {
  Patient,
  PatientListResponse,
  PatientsQueryParams,
  CreatePatientDto,
  CreatePatientResponse,
} from "@/models/patient.model";

const endpoint = "/api/patients";

const buildQueryString = (params?: PatientsQueryParams) => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const PatientsService = {
  async getPatients(
    params?: PatientsQueryParams
  ): Promise<PatientListResponse> {
    const query = buildQueryString(params);

    const response = await httpClient.request(`${endpoint}${query}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch patients");
    }

    return data as PatientListResponse;
  },

  async createPatient(dto: CreatePatientDto): Promise<CreatePatientResponse> {

  
    const response = await httpClient.request(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const data = await response.json();

    if (!response.ok) {
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message ?? "Failed to create patient";
      throw new Error(message);
    }

    return data as CreatePatientResponse;
  },
};

export type {
  Patient,
  PatientListResponse,
  PatientsQueryParams,
  CreatePatientDto,
  CreatePatientResponse,
};
