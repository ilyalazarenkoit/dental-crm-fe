"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { User, Phone, MapPin, Tag } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { PatientsService } from "@/lib/api/patients.service";
import type { CreatePatientDto } from "@/models/patient.model";
import { createPatientSchema, type CreatePatientFormData } from "./schema";
import type { CreatePatientFormProps } from "./types";
import { FormSectionHeader } from "./FormSectionHeader";
import { TagsInput } from "./TagsInput";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ContactSection } from "./ContactSection";
import { AddressSection } from "./AddressSection";

export const CreatePatientForm = ({
  formId,
  onSuccess,
  onSubmittingChange,
}: CreatePatientFormProps) => {
  const { t } = useTranslation("common");
  const { toast } = useToast();

  const form = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: undefined,
      phone: "",
      email: "",
      addressStreet: "",
      addressCity: "",
      addressZip: "",
      addressCountry: "",
      tags: [],
    },
  });

  const onSubmit = async (formData: CreatePatientFormData) => {
    onSubmittingChange?.(true);

    const dto: CreatePatientDto = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dateOfBirth: formData.dateOfBirth,
      ...(formData.gender && { gender: formData.gender }),
      ...(formData.phone?.trim() && { phone: formData.phone.trim() }),
      ...(formData.email?.trim() && { email: formData.email.trim() }),
      ...(formData.addressStreet?.trim() && {
        addressStreet: formData.addressStreet.trim(),
      }),
      ...(formData.addressCity?.trim() && {
        addressCity: formData.addressCity.trim(),
      }),
      ...(formData.addressZip?.trim() && {
        addressZip: formData.addressZip.trim(),
      }),
      ...(formData.addressCountry?.trim() && {
        addressCountry: formData.addressCountry.trim(),
      }),
      ...(formData.tags?.length && { tags: formData.tags }),
    };

    try {
      const response = await PatientsService.createPatient(dto);
      toast({ title: t("patients.create.success"), variant: "success" });
      form.reset();
      onSuccess(response.data);
    } catch (error) {
      toast({
        title: t("patients.create.error"),
        description:
          error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      onSubmittingChange?.(false);
    }
  };

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 px-6 py-4">
          <FormSectionHeader
            icon={User}
            title={t("patients.create.sections.personal")}
          />
          <PersonalInfoSection control={form.control} />

          <Separator />

          <FormSectionHeader
            icon={Phone}
            title={t("patients.create.sections.contact")}
          />
          <ContactSection control={form.control} />

          <Separator />

          <FormSectionHeader
            icon={MapPin}
            title={t("patients.create.sections.address")}
          />
          <AddressSection control={form.control} />

          <Separator />

          <FormSectionHeader
            icon={Tag}
            title={t("patients.create.sections.tags")}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <TagsInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("patients.create.fields.tags-placeholder")}
                    hint={t("patients.create.fields.tags-hint")}
                    error={fieldState.error?.message}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-sm font-medium text-destructive">
                    {t(
                      `patients.create.validation.${fieldState.error.message}`
                    )}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
