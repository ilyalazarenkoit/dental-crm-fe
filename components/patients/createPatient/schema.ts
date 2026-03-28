import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

const nonWhitespaceString = (maxLen: number) =>
  z
    .string()
    .max(maxLen)
    .refine((v) => !v || v.trim().length > 0, { message: "whitespace" });

export const createPatientSchema = z.object({
  firstName: z
    .string()
    .min(1, "first-name-required")
    .max(100, "first-name-max")
    .refine((v) => v.trim().length > 0, "first-name-whitespace"),

  lastName: z
    .string()
    .min(1, "last-name-required")
    .max(100, "last-name-max")
    .refine((v) => v.trim().length > 0, "last-name-whitespace"),

  dateOfBirth: z
    .string()
    .min(1, "dob-required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dob-format")
    .refine((v) => {
      if (!v) return true;
      return new Date(v) <= new Date();
    }, "dob-future"),

  gender: z.enum(["male", "female", "other"]).optional(),

  phone: z
    .union([
      z.literal(""),
      z
        .string()
        .max(30, "phone-max")
        .refine((v) => isValidPhoneNumber(v), "phone-format"),
    ])
    .optional(),

  email: z
    .union([
      z.literal(""),
      z.string().email("email-invalid").max(255, "email-max"),
    ])
    .optional(),

  addressStreet: nonWhitespaceString(255).optional(),
  addressCity: nonWhitespaceString(100).optional(),
  addressZip: nonWhitespaceString(20).optional(),
  addressCountry: nonWhitespaceString(100).optional(),

  tags: z
    .array(z.string().min(1).max(50, "tag-max"))
    .max(20, "tags-max")
    .default([]),
});

export type CreatePatientFormData = z.infer<typeof createPatientSchema>;
