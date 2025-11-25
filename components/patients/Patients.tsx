"use client";

import type { FC } from "react";
import { useEffect } from "react";
import { PatientsService } from "@/lib/api/patients.service";
import { PatientsFilter } from "./PatientsFilter";
import { PatientsList } from "./PatientsList";

export const Patients: FC = () => {
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await PatientsService.getPatients();
        console.log("Patients response:", response);
      } catch (error) {
        console.error("Failed to load patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <PatientsFilter />
      <PatientsList />
    </div>
  );
};
