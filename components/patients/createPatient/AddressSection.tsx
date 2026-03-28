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

export const AddressSection = ({ control }: FormSectionProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="addressStreet"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{t("patients.create.fields.address-street")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("patients.create.fields.address-street-placeholder")}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="addressCity"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("patients.create.fields.address-city")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder={t("patients.create.fields.address-city-placeholder")}
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
          name="addressZip"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("patients.create.fields.address-zip")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder={t("patients.create.fields.address-zip-placeholder")}
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
        name="addressCountry"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{t("patients.create.fields.address-country")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("patients.create.fields.address-country-placeholder")}
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
