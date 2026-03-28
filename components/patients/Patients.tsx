"use client";

import { type FC, useCallback, useEffect, useState } from "react";
import { PatientsService } from "@/lib/api/patients.service";
import type { Patient } from "@/models/patient.model";
import { PatientsFilter } from "./PatientsFilter";
import { PatientsList } from "./PatientsList";
import { CreatePatientModal } from "./createPatient/CreatePatientModal";

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
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <CreatePatientModal onPatientCreated={handlePatientCreated} />
      </div>
      <PatientsFilter />
      <PatientsList patients={patients} isLoading={isLoading} />
    </div>
  );
};
