"use client";

import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerField } from "@/components/ui/date-picker-field";
import type { FormSectionProps } from "./types";

export const PersonalInfoSection = ({ control }: FormSectionProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                {t("patients.create.fields.first-name")}
                <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  placeholder={t(
                    "patients.create.fields.first-name-placeholder",
                  )}
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
          name="lastName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                {t("patients.create.fields.last-name")}
                <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(
                    "patients.create.fields.last-name-placeholder",
                  )}
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

      <FormField
        control={control}
        name="dateOfBirth"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              {t("patients.create.fields.date-of-birth")}
              <span className="text-destructive ml-1">*</span>
            </FormLabel>
            <FormControl>
              <DatePickerField
                value={field.value}
                onChange={field.onChange}
                placeholder={t(
                  "patients.create.fields.date-of-birth-placeholder",
                )}
                toYear={new Date().getFullYear()}
                fromYear={1900}
                error={!!fieldState.error}
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
        name="gender"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{t("patients.create.fields.gender")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger
                  className={fieldState.error ? "border-destructive" : ""}
                >
                  <SelectValue
                    placeholder={t("patients.create.fields.gender-placeholder")}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">
                  {t("patients.create.fields.gender-male")}
                </SelectItem>
                <SelectItem value="female">
                  {t("patients.create.fields.gender-female")}
                </SelectItem>
                <SelectItem value="other">
                  {t("patients.create.fields.gender-other")}
                </SelectItem>
              </SelectContent>
            </Select>
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
