"use client";

import { useState, type FC } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Patient } from "@/models/patient.model";
import { CreatePatientForm } from "./CreatePatientForm";
import type { CreatePatientModalProps } from "./types";

const FORM_ID = "create-patient-form";

export const CreatePatientModal: FC<CreatePatientModalProps> = ({
  onPatientCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation("common");

  const handleSuccess = (patient: Patient) => {
    setOpen(false);
    onPatientCreated?.(patient);
  };

  const handleOpenChange = (next: boolean) => {
    if (!isSubmitting) {
      setOpen(next);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 px-6 py-4">
          <Plus className="h-4 w-4" />
          {t("patients.new-patient")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle>{t("patients.create.title")}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <CreatePatientForm
            formId={FORM_ID}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
            onSubmittingChange={setIsSubmitting}
          />
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t("patients.create.submitting")}
              </>
            ) : (
              t("patients.create.submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
