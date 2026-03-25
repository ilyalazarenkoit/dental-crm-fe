"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/utils/toast";
import { Eye, EyeSlash, SpinnerGap, CheckCircle } from "phosphor-react";
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
import { Progress } from "@/components/ui/progress";
import { ROUTES } from "@/constants/routes";
import { registerSchema, defaultRegistrationValues } from "@/models/auth.model";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { usePasswordConfirmation } from "@/hooks/usePasswordConfirmation";
import { useEmailInput } from "@/hooks/useEmailInput";
import { usePhoneInput } from "@/hooks/usePhoneInput";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import { PasswordRequirements } from "@components/ui/password-requirements";
import { AuthErrorDisplay } from "@components/auth/AuthErrorDisplay";
import { FullScreenLoader } from "@components/ui/full-screen-loader";
import { EmailVerificationNotice } from "@components/auth/register/EmailVerificationNotice";
import { AuthService } from "@lib/api/auth.service";
import { handleApiResponse } from "@/lib/error-handler";

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
  const [formProgress, setFormProgress] = useState(0);
  const [hasValidatedEmail, setHasValidatedEmail] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegistrationValues,
    mode: "onTouched",
  });

  // Watch form values for progress calculation
  const watchedValues = form.watch();
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    mobilePhone,
    organizationName,
  } = watchedValues;

  // Custom hooks
  const emailInput = useEmailInput(email);
  const phoneInput = usePhoneInput(mobilePhone);
  const passwordValidation = usePasswordValidation(password);
  const { validationState, validateOnBlur } = useEmailValidation(email);
  const { isValid: passwordsMatch, errorMessage: passwordMatchError } =
    usePasswordConfirmation(password, confirmPassword);

  const { isValid, isChecking, errorMessage } = validationState;

  // Track when email validation is complete (after blur or validation)
  useEffect(() => {
    if (email && email.trim().length > 0 && !isChecking) {
      setHasValidatedEmail(true);
    }
  }, [email, isChecking]);

  // Calculate form completion progress based on VALID fields only
  useEffect(() => {
    const fieldValidations = [
      // First name - valid if not empty and no errors
      firstName &&
        firstName.trim().length > 0 &&
        !form.formState.errors.firstName,
      // Last name - valid if not empty and no errors
      lastName && lastName.trim().length > 0 && !form.formState.errors.lastName,
      // Email - valid if validation is complete AND email is actually valid
      hasValidatedEmail &&
        email &&
        email.trim().length > 0 &&
        !isChecking &&
        isValid &&
        !errorMessage &&
        !form.formState.errors.email &&
        emailInput.value === email &&
        email.includes("@") && // Basic email format check
        email.includes(".") && // Basic email format check
        email.length > 5, // Minimum reasonable email length
      // Password - valid if meets all requirements AND user has actually typed something
      password &&
        password.length > 0 &&
        passwordValidation.isValid &&
        !form.formState.errors.password,
      // Confirm password - valid if matches password AND user has actually typed something
      passwordsMatch &&
        confirmPassword &&
        confirmPassword.length > 0 &&
        !form.formState.errors.confirmPassword,
      // Mobile phone - valid if not empty and no errors
      mobilePhone &&
        mobilePhone.trim().length > 0 &&
        !form.formState.errors.mobilePhone,
      // Organization name - valid if not empty and no errors
      organizationName &&
        organizationName.trim().length > 0 &&
        !form.formState.errors.organizationName,
    ];

    const validFields = fieldValidations.filter(Boolean).length;
    const progress = Math.round((validFields / fieldValidations.length) * 100);
    setFormProgress(progress);
  }, [
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    mobilePhone,
    organizationName,
    isValid,
    isChecking,
    errorMessage,
    passwordValidation.isValid,
    passwordsMatch,
    form.formState.errors,
    emailInput.value,
    hasValidatedEmail,
  ]);

  // Update form values when custom inputs change
  useEffect(() => {
    if (emailInput.value !== email) {
      form.setValue("email", emailInput.value, { shouldValidate: false });
    }
  }, [emailInput.value, email, form]);

  useEffect(() => {
    form.setValue("mobilePhone", phoneInput.rawValue, {
      shouldValidate: false,
    });
  }, [phoneInput.rawValue, form]);

  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    if (!isValid || isChecking) {
      toast.error(
        t(
          "register.errors.email-validation",
          "Please complete email validation"
        )
      );
      return;
    }

    if (!passwordsMatch && confirmPassword) {
      toast.error(
        t("register.errors.password-mismatch", "Passwords do not match")
      );
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const registerData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password,
        mobilePhone: data.mobilePhone.trim(),
        organizationName: data.organizationName.trim(),
      };

      const response = await AuthService.register(registerData);
      const result = handleApiResponse(response, t, "register.errors");

      if (result.success) {
        setRegisteredEmail(data.email);
        setRegistrationComplete(true);
        toast.success(t("register.registration-form.register-success"));
      } else {
        setFormError(result.message || t("register.errors.default"));

        // Focus on problematic field
        if (
          response.error?.code === "E409_USER_WITH_THIS_EMAIL_ALREADY_EXISTS"
        ) {
          form.setFocus("email");
        } else if (response.error?.code === "E400_VALIDATION_ERROR") {
          // Focus on first field with error
          const firstErrorField = Object.keys(
            form.formState.errors
          )[0] as keyof RegisterFormValues;
          if (firstErrorField) {
            form.setFocus(firstErrorField);
          }
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFormError(t("register.errors.default"));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setFormError(null);

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("register.progress", "Form completion")}
              </span>
              <span className="font-medium">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>

          {/* Error Display */}
          <AuthErrorDisplay
            error={formError}
            onClose={clearError}
            variant="destructive"
          />

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="cursor-pointer text-sm font-medium">
                    {t("register.registration-form.first-name")}
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder={t(
                          "register.registration-form.first-name-placeholder"
                        )}
                        className={
                          form.formState.errors.firstName
                            ? "border-red-400 focus-visible:ring-red-400 pr-10"
                            : "pr-10"
                        }
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Trim whitespace on blur
                          if (!e.target.value) return;
                          const trimmed = e.target.value.trim();
                          if (trimmed !== e.target.value) {
                            field.onChange(trimmed);
                          }
                        }}
                      />
                    </FormControl>
                    {/* Green checkmark for valid first name */}
                    {firstName &&
                      firstName.trim().length > 0 &&
                      !form.formState.errors.firstName && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="cursor-pointer text-sm font-medium">
                    {t("register.registration-form.last-name")}
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder={t(
                          "register.registration-form.last-name-placeholder"
                        )}
                        className={
                          form.formState.errors.lastName
                            ? "border-red-400 focus-visible:ring-red-400 pr-10"
                            : "pr-10"
                        }
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e.target.value) return;
                          const trimmed = e.target.value.trim();
                          if (trimmed !== e.target.value) {
                            field.onChange(trimmed);
                          }
                        }}
                      />
                    </FormControl>
                    {/* Green checkmark for valid last name */}
                    {lastName &&
                      lastName.trim().length > 0 &&
                      !form.formState.errors.lastName && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  className="cursor-pointer text-sm font-medium"
                  htmlFor="email-input"
                >
                  {t("register.registration-form.email")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="email-input"
                      type="email"
                      placeholder={t("register.registration-form.email")}
                      className={
                        errorMessage || form.formState.errors.email
                          ? "pr-10 border-red-400 focus-visible:ring-red-400"
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
                    {/* Green checkmark for valid email */}
                    {hasValidatedEmail &&
                      email &&
                      email.trim().length > 0 &&
                      !isChecking &&
                      isValid &&
                      !errorMessage &&
                      !form.formState.errors.email &&
                      email.includes("@") && // Basic email format check
                      email.includes(".") && // Basic email format check
                      email.length > 5 && ( // Minimum reasonable email length
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                  </div>
                </FormControl>
                {errorMessage && !form.formState.errors.email ? (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                ) : (
                  <FormMessage />
                )}
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="cursor-pointer text-sm font-medium">
                  {t("register.registration-form.password")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("register.registration-form.password")}
                      className={
                        form.formState.errors.password
                          ? "border-red-400 focus-visible:ring-red-400 pr-20"
                          : "pr-20"
                      }
                      {...field}
                    />
                  </FormControl>
                  {/* Green checkmark for valid password - positioned before the eye button */}
                  {passwordValidation.isValid &&
                    !form.formState.errors.password && (
                      <div className="absolute inset-y-0 right-12 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FormMessage />

                {/* Password Requirements */}
                {password.length > 0 && (
                  <PasswordRequirements
                    hasMinLength={passwordValidation.hasMinLength}
                    hasUppercase={passwordValidation.hasUppercase}
                    hasNumber={passwordValidation.hasNumber}
                    hasSpecialChar={passwordValidation.hasSpecialChar}
                    strength={passwordValidation.strength}
                    className="mt-3"
                  />
                )}
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  className="cursor-pointer text-sm font-medium"
                  htmlFor="confirm-password-input"
                >
                  {t("register.registration-form.confirm-password")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      id="confirm-password-input"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t(
                        "register.registration-form.confirm-password"
                      )}
                      className={
                        form.formState.errors.confirmPassword || !passwordsMatch
                          ? "border-red-400 focus-visible:ring-red-400 pr-20"
                          : "pr-20"
                      }
                      {...field}
                    />
                  </FormControl>
                  {/* Green checkmark for valid confirm password - positioned before the eye button */}
                  {passwordsMatch &&
                    confirmPassword &&
                    !form.formState.errors.confirmPassword && (
                      <div className="absolute inset-y-0 right-12 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    tabIndex={-1}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword ? (
                  <FormMessage />
                ) : (
                  passwordMatchError &&
                  confirmPassword &&
                  passwordsMatch === false && (
                    <p className="text-sm text-destructive">
                      {passwordMatchError}
                    </p>
                  )
                )}
              </FormItem>
            )}
          />

          {/* Mobile Phone Field */}
          <FormField
            control={form.control}
            name="mobilePhone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="cursor-pointer text-sm font-medium">
                  {t("register.registration-form.mobile-phone")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={t("register.registration-form.mobile-phone")}
                      className={
                        form.formState.errors.mobilePhone
                          ? "border-red-400 focus-visible:ring-red-400 pr-10"
                          : "pr-10"
                      }
                      value={phoneInput.value}
                      onChange={phoneInput.handleChange}
                      onKeyDown={phoneInput.handleKeyDown}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  {/* Green checkmark for valid mobile phone */}
                  {mobilePhone &&
                    mobilePhone.trim().length > 0 &&
                    !form.formState.errors.mobilePhone && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Organization Name Field */}
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="cursor-pointer text-sm font-medium">
                  {t("register.registration-form.organization-name")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder={t(
                        "register.registration-form.organization-name"
                      )}
                      className={
                        form.formState.errors.organizationName
                          ? "border-red-400 focus-visible:ring-red-400 pr-10"
                          : "pr-10"
                      }
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!e.target.value) return;
                        const trimmed = e.target.value.trim();
                        if (trimmed !== e.target.value) {
                          field.onChange(trimmed);
                        }
                      }}
                    />
                  </FormControl>
                  {/* Green checkmark for valid organization name */}
                  {organizationName &&
                    organizationName.trim().length > 0 &&
                    !form.formState.errors.organizationName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                isChecking ||
                !form.formState.isValid ||
                !passwordsMatch ||
                !isValid
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
