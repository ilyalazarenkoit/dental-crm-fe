"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "keep-react";
import { Eye, EyeSlash, SpinnerGap } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ROUTES } from "@/constants/routes";
import { registerSchema, defaultRegistrationValues } from "@/models/auth.model";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { usePasswordConfirmation } from "@/hooks/usePasswordConfirmation";
import { useEmailInput } from "@/hooks/useEmailInput";
import { usePhoneInput } from "@/hooks/usePhoneInput";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import { PasswordRequirements } from "@components/ui/password-requirements";
import { AnimatePresence, motion } from "framer-motion";
import { FullScreenLoader } from "@components/ui/full-screen-loader";
import { EmailVerificationNotice } from "@components/auth/register/EmailVerificationNotice";
import { AuthService } from "@lib/api/auth.service";
import { handleApiResponse } from "@/lib/error-handler";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Validation schema using Zod

registerSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegistrationValues,
    mode: "onTouched", // Enable validation on change
  });

  // Get current email value from form
  const emailValue = form.watch("email");

  // Get password values from form
  const passwordValue = form.watch("password");
  const confirmPasswordValue = form.watch("confirmPassword");

  // Custom email input handling
  const emailInput = useEmailInput(emailValue);

  // Custom phone input handling
  const phoneInput = usePhoneInput(form.watch("mobilePhone"));

  // Password validation
  const passwordValidation = usePasswordValidation(passwordValue);

  // Update form values when our custom inputs change
  useEffect(() => {
    if (emailInput.value !== emailValue) {
      form.setValue("email", emailInput.value, { shouldValidate: false });
    }
  }, [emailInput.value, emailValue, form]);

  useEffect(() => {
    form.setValue("mobilePhone", phoneInput.rawValue, {
      shouldValidate: false,
    });
  }, [phoneInput.rawValue, form]);

  // Custom email validation with debounce
  const { validationState, validateOnBlur } = useEmailValidation(emailValue);
  const { isValid, isChecking, errorMessage } = validationState;

  // Custom password confirmation validation with debounce
  const { isValid: passwordsMatch, errorMessage: passwordMatchError } =
    usePasswordConfirmation(passwordValue, confirmPasswordValue);

  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    if (!isValid || isChecking) {
      return;
    }

    if (!passwordsMatch && confirmPasswordValue) {
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const {
        firstName,
        lastName,
        email,
        password,
        mobilePhone,
        organizationName,
      } = data;

      const registerData = {
        firstName,
        lastName,
        email,
        password,
        mobilePhone,
        organizationName,
      };

      const response = await AuthService.register(registerData);

      const result = handleApiResponse(response, t, "register.errors");

      if (result.success) {
        setRegisteredEmail(data.email);
        setRegistrationComplete(true);
        toast.success(t("register.registration-form.register-success"));
      } else {
        setFormError(result.message || t("register.errors.default"));

        if (
          response.error?.code === "E409_USER_WITH_THIS_EMAIL_ALREADY_EXISTS"
        ) {
          form.setFocus("email");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFormError(t("register.errors.default"));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (registrationComplete) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <EmailVerificationNotice
          email={registeredEmail}
          onClose={() => router.push(ROUTES.signin)}
        />
      </div>
    );
  }

  return (
    <>
      <FullScreenLoader
        isLoading={isLoading}
        message={t("auth.registering", "Creating your account...")}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 h-3/4"
        >
          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="cursor-pointer">
                    {t("register.registration-form.first-name")}
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "register.registration-form.first-name-placeholder"
                      )}
                      className={
                        form.formState.errors.firstName
                          ? "border-red-400 focus-visible:ring-red-400 focus-visible:ring-opacity-50 focus-visible:border-red-400"
                          : ""
                      }
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-[1.25em]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="cursor-pointer">
                    {t("register.registration-form.last-name")}
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "register.registration-form.last-name-placeholder"
                      )}
                      className={
                        form.formState.errors.lastName
                          ? "border-red-400 focus-visible:ring-red-400 focus-visible:ring-opacity-50 focus-visible:border-red-400"
                          : ""
                      }
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-[1.25em]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel className="cursor-pointer" htmlFor="email-input">
                  {t("register.registration-form.email")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="email-input"
                      type="email"
                      placeholder={t(
                        "register.registration-form.email-placeholder"
                      )}
                      className={
                        errorMessage || form.formState.errors.email
                          ? "pr-10 border-red-400 focus-visible:ring-red-400 focus-visible:ring-opacity-50 focus-visible:border-red-400"
                          : "pr-10"
                      }
                      value={emailInput.value}
                      onChange={emailInput.handleChange}
                      onKeyDown={emailInput.handleKeyDown}
                      onPaste={emailInput.handlePaste}
                      onBlur={() => {
                        field.onBlur();
                        validateOnBlur();
                      }}
                    />
                    {isChecking && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <SpinnerGap className="h-5 w-5 text-gray-400 animate-spin" />
                      </div>
                    )}
                  </div>
                </FormControl>
                {/* Show custom error message from email validation */}
                {errorMessage && !form.formState.errors.email ? (
                  <div className="min-h-[1.25em]">
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {errorMessage}
                    </p>
                  </div>
                ) : (
                  <div className="min-h-[1.25em]">
                    <FormMessage />
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="cursor-pointer">
                  {t("register.registration-form.password")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t(
                        "register.registration-form.password-placeholder"
                      )}
                      className={
                        form.formState.errors.password
                          ? "border-red-400 focus-visible:ring-red-400 focus-visible:ring-opacity-50 focus-visible:border-red-400 pr-10"
                          : "pr-10"
                      }
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="min-h-[1.25em]">
                  <FormMessage />
                </div>
                {/* Password requirements component */}
                <AnimatePresence>
                  {passwordValue.length > 0 && (
                    <PasswordRequirements
                      hasMinLength={passwordValidation.hasMinLength}
                      hasUppercase={passwordValidation.hasUppercase}
                      hasNumber={passwordValidation.hasNumber}
                      hasSpecialChar={passwordValidation.hasSpecialChar}
                      strength={passwordValidation.strength}
                      className="mt-2"
                    />
                  )}
                </AnimatePresence>
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel
                  className="cursor-pointer"
                  htmlFor="confirm-password-input"
                >
                  {t("register.registration-form.confirm-password")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="confirm-password-input"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t(
                        "register.registration-form.confirm-password-placeholder"
                      )}
                      className={
                        form.formState.errors.confirmPassword || !passwordsMatch
                          ? "pr-10 border-red-400 focus-visible:ring-red-400 focus-visible:ring-opacity-50 focus-visible:border-red-400"
                          : "pr-10"
                      }
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeSlash className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {/* Показываем либо сообщение от react-hook-form, либо от нашего кастомного хука */}
                {form.formState.errors.confirmPassword ? (
                  <div className="min-h-[1.25em]">
                    <FormMessage />
                  </div>
                ) : (
                  <div className="min-h-[1.25em]">
                    {passwordMatchError &&
                      confirmPasswordValue &&
                      passwordsMatch === false && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                          {passwordMatchError}
                        </p>
                      )}
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* Mobile Phone */}
          <FormField
            control={form.control}
            name="mobilePhone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="cursor-pointer">
                  {t("register.registration-form.mobile-phone")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t(
                      "register.registration-form.mobile-phone-placeholder"
                    )}
                    className={
                      form.formState.errors.mobilePhone
                        ? "border-red-400 focus-visible:ring-red-400 focus-visible:ring-opacity-50 focus-visible:border-red-400"
                        : ""
                    }
                    value={phoneInput.value}
                    onChange={phoneInput.handleChange}
                    onKeyDown={phoneInput.handleKeyDown}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <div className="min-h-[1.25em]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Organization Name */}
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="cursor-pointer">
                  {t("register.registration-form.organization-name")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "register.registration-form.organization-name-placeholder"
                    )}
                    className={
                      form.formState.errors.organizationName
                        ? "border-red-400 focus-visible:ring-red-400 focus-visible:ring-opacity-50 focus-visible:border-red-400"
                        : ""
                    }
                    {...field}
                  />
                </FormControl>
                <div className="min-h-[1.25em]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                isChecking ||
                !form.formState.isValid ||
                !passwordsMatch
              }
            >
              {isLoading ? (
                <>
                  <SpinnerGap className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.registering", "Creating account...")}
                </>
              ) : (
                t("register.registration-form.submit", "Create Account")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
