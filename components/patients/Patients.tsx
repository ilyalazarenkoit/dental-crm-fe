"use client";

import { type FC, useCallback, useEffect, useState } from "react";
import { PatientsService } from "@/lib/api/patients.service";
import type { Patient } from "@/models/patient.model";
import { PatientsFilter } from "./PatientsFilter";
import { PatientsList } from "./PatientsList";
import { CreatePatientModal } from "./createPatient/CreatePatientModal";
import { CrmPageHeader } from "@/components/navigation";

export const Patients: FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await PatientsService.getPatients();
      setPatients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handlePatientCreated = useCallback((newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
  }, []);

  return (
    <div className="px-6">
      <CrmPageHeader
        title="Patients"
        description="Browse your patient base, refine the list, and add new records without leaving the CRM flow."
        actions={<CreatePatientModal onPatientCreated={handlePatientCreated} />}
      />
      <PatientsFilter />
      <PatientsList patients={patients} isLoading={isLoading} />
    </div>
  );
};
