import type { Control } from "react-hook-form";
import type { CreatePatientFormData } from "./schema";
import type { Patient } from "@/models/patient.model";

export interface FormSectionProps {
  control: Control<CreatePatientFormData>;
}

export interface CreatePatientFormProps {
  formId: string;
  onSuccess: (patient: Patient) => void;
  onCancel: () => void;
  onSubmittingChange?: (isSubmitting: boolean) => void;
}

export interface CreatePatientModalProps {
  onPatientCreated?: (patient: Patient) => void;
}
