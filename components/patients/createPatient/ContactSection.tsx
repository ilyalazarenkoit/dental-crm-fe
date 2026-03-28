"use client";

import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FormSectionProps } from "./types";

export const ContactSection = ({ control }: FormSectionProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="phone"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{t("patients.create.fields.phone")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                value={field.value ?? ""}
                placeholder={t("patients.create.fields.phone-placeholder")}
                className={fieldState.error ? "border-destructive" : ""}
              />
            </FormControl>
            {fieldState.error && (
              <p className="text-sm font-medium text-destructive">
                {t(`patients.create.validation.${fieldState.error.message}`)}
              </p>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{t("patients.create.fields.email")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                value={field.value ?? ""}
                placeholder={t("patients.create.fields.email-placeholder")}
                className={fieldState.error ? "border-destructive" : ""}
              />
            </FormControl>
            {fieldState.error && (
              <p className="text-sm font-medium text-destructive">
                {t(`patients.create.validation.${fieldState.error.message}`)}
              </p>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};
