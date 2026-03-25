"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const PatientsFilter = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search patients..."
          className="pl-10"
          disabled
        />
      </div>
      <Button variant="outline" disabled className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>
    </div>
  );
};
