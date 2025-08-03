import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

/**
 * Password confirmation validation states
 */
export type PasswordConfirmationState = {
  isValid: boolean;
  errorMessage: string | null;
};

/**
 * Custom hook for validating password confirmation with debounce
 * @param password Primary password
 * @param confirmPassword Confirmation password to validate
 * @param debounceMs Debounce delay in milliseconds
 * @returns Password confirmation validation state
 */
export function usePasswordConfirmation(
  password: string,
  confirmPassword: string,
  debounceMs: number = 1000 // 1 second debounce
): PasswordConfirmationState {
  const [validationState, setValidationState] =
    useState<PasswordConfirmationState>({
      isValid: true,
      errorMessage: null,
    });

  // Track if we've started typing but haven't validated yet
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Debounce the confirmation password value to avoid excessive validation
  const debouncedConfirmPassword = useDebounce(confirmPassword, debounceMs);

  // Effect to track when user starts typing
  useEffect(() => {
    if (confirmPassword && !hasStartedTyping) {
      setHasStartedTyping(true);

      // Reset any previous error messages when starting to type
      if (validationState.errorMessage) {
        setValidationState((prev) => ({
          ...prev,
          errorMessage: null,
          isValid: true,
        }));
      }
    }
  }, [confirmPassword, hasStartedTyping, validationState.errorMessage]);

  // Validation logic
  const validatePasswordMatch = () => {
    // Skip validation for empty confirmation password (form validation will handle required)
    if (!confirmPassword) {
      setValidationState({
        isValid: true,
        errorMessage: null,
      });
      return;
    }

    // Skip validation for very short confirmation passwords to avoid premature validation
    if (confirmPassword.length < 3) {
      setValidationState({
        isValid: true,
        errorMessage: null,
      });
      return;
    }

    // Check if passwords match
    const doPasswordsMatch = password === confirmPassword;

    setValidationState({
      isValid: doPasswordsMatch,
      errorMessage: doPasswordsMatch ? null : "Passwords do not match",
    });
  };

  // Effect for debounced validation - only run after typing has paused for debounceMs
  useEffect(() => {
    // Only validate if we have a debounced value and it's different from the current value
    // This ensures we only validate after the user has stopped typing for debounceMs
    if (
      debouncedConfirmPassword &&
      debouncedConfirmPassword === confirmPassword &&
      hasStartedTyping
    ) {
      validatePasswordMatch();
    }
  }, [debouncedConfirmPassword, confirmPassword, password, hasStartedTyping]);

  // Effect to immediately clear error when passwords match in real-time (without debounce)
  useEffect(() => {
    // Skip for empty confirmation password
    if (!confirmPassword || confirmPassword.length < 3) {
      return;
    }

    // If we already have an error but the passwords now match, immediately clear the error
    if (validationState.errorMessage && password === confirmPassword) {
      setValidationState({
        isValid: true,
        errorMessage: null,
      });
    }
  }, [confirmPassword, password, validationState.errorMessage]);

  // New effect to validate when primary password changes and confirmPassword is already filled
  useEffect(() => {
    // Only run this effect if confirmPassword is already filled
    if (confirmPassword && confirmPassword.length >= 3) {
      // Check if passwords match
      const doPasswordsMatch = password === confirmPassword;

      // Update validation state based on current match status
      setValidationState({
        isValid: doPasswordsMatch,
        errorMessage: doPasswordsMatch ? null : "Passwords do not match",
      });
    }
  }, [password, confirmPassword]);

  return validationState;
}
