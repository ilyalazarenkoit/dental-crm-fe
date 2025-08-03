import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

/**
 * Email validation states
 */
export type EmailValidationState = {
  isValid: boolean;
  isChecking: boolean;
  errorMessage: string | null;
};

/**
 * Custom hook for validating email with debounce
 * @param email Email to validate
 * @param debounceMs Debounce delay in milliseconds
 * @param validateOnBlur Whether to trigger validation on blur event
 * @returns Email validation state and a function to trigger validation on blur
 */
export function useEmailValidation(
  email: string,
  debounceMs: number = 2000, // 2 seconds debounce
  validateOnBlur: boolean = true
): {
  validationState: EmailValidationState;
  validateOnBlur: () => void;
} {
  const [validationState, setValidationState] = useState<EmailValidationState>({
    isValid: true,
    isChecking: false,
    errorMessage: null,
  });

  // Track if validation should be triggered immediately (for blur events)
  const [shouldValidateImmediately, setShouldValidateImmediately] =
    useState(false);

  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Debounce the email value to avoid excessive validation
  const debouncedEmail = useDebounce(email, debounceMs);

  // Effect to detect when user starts typing
  useEffect(() => {
    if (email && !hasStartedTyping) {
      setHasStartedTyping(true);
    }
  }, [email, hasStartedTyping]);

  // Function to trigger validation immediately (for blur events)
  const triggerValidation = () => {
    if (validateOnBlur && email) {
      setShouldValidateImmediately(true);
    }
  };

  // Validation logic
  const validateEmail = async (emailToValidate: string) => {
    // Skip validation for empty email (form validation will handle this)
    if (!emailToValidate) {
      setValidationState({
        isValid: true,
        isChecking: false,
        errorMessage: null,
      });
      return;
    }

    // Skip validation for very short emails (less than 5 chars)
    // This prevents showing errors too early when user is still typing
    if (emailToValidate.length < 5 && !shouldValidateImmediately) {
      return;
    }

    // Set checking state
    setValidationState((prev) => ({
      ...prev,
      isChecking: true,
    }));

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(emailToValidate);

    if (!isValidFormat) {
      setValidationState({
        isValid: false,
        isChecking: false,
        errorMessage: "Invalid email format",
      });
      return;
    }

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Example validation logic
      // In a real app, replace this with an actual API call
      const isEmailTaken =
        emailToValidate.includes("taken") || emailToValidate.includes("exists");

      setValidationState({
        isValid: !isEmailTaken,
        isChecking: false,
        errorMessage: isEmailTaken ? "Email is already registered" : null,
      });
    } catch (error) {
      console.error("Email validation error:", error);
      setValidationState({
        isValid: true, // Don't block submission on API error
        isChecking: false,
        errorMessage: null,
      });
    }
  };

  // Effect for debounced validation
  useEffect(() => {
    if (debouncedEmail && debouncedEmail === email && hasStartedTyping) {
      validateEmail(debouncedEmail);
    }
  }, [debouncedEmail, email, hasStartedTyping]);

  // Effect for immediate validation (blur)
  useEffect(() => {
    if (shouldValidateImmediately) {
      validateEmail(email);
      setShouldValidateImmediately(false);
    }
  }, [shouldValidateImmediately, email]);

  // Effect to check email format in real-time (without debounce)
  // This allows us to clear error messages immediately when format becomes valid
  useEffect(() => {
    // Skip for empty or very short emails
    if (!email || email.length < 5) {
      return;
    }

    // If we already have an error and the user is typing, reset the error state
    if (validationState.errorMessage) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(email);

      if (isValidFormat) {
        setValidationState((prev) => ({
          ...prev,
          isValid: true,
          errorMessage: null,
          isChecking: true, // Set to checking until the debounced validation completes
        }));
      }
    }
  }, [email, validationState.errorMessage]);

  return {
    validationState,
    validateOnBlur: triggerValidation,
  };
}
