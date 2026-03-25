"use client";

import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PatientsListProps {
  isLoading?: boolean;
}

export const PatientsList = ({ isLoading = false }: PatientsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
          >
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Users className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No patients yet
      </h3>
      <p className="text-gray-500 max-w-sm">
        Patient records will appear here once the system is connected to the
        database.
      </p>
    </div>
  );
};
