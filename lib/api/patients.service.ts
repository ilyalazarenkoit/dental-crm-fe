import { httpClient } from "@/lib/api/http-client";
import {
  Patient,
  PatientListResponse,
  PatientsQueryParams,
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
};

export type { Patient, PatientListResponse, PatientsQueryParams };
