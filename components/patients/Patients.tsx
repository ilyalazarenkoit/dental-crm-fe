"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { PatientsService } from "@/lib/api/patients.service";
import { PatientsFilter } from "./PatientsFilter";
import { PatientsList } from "./PatientsList";

export const Patients: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        await PatientsService.getPatients();
      } catch (error) {
        console.error("Failed to load patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-600 mt-1">Manage your patient records</p>
      </div>
      <PatientsFilter />
      <PatientsList isLoading={isLoading} />
    </div>
  );
};
