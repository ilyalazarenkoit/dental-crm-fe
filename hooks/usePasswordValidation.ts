import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

/**
 * Password validation states
 */
export type PasswordValidationState = {
  isValid: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
  errorMessage: string | null;
  strength: "weak" | "medium" | "strong";
};

/**
 * Custom hook for validating password with requirements
 * @param password Password to validate
 * @param minLength Minimum password length
 * @param debounceMs Debounce delay in milliseconds
 * @returns Password validation state
 */
export function usePasswordValidation(
  password: string,
  minLength: number = 6,
  debounceMs: number = 500 // 0.5 second debounce
): PasswordValidationState {
  const [validationState, setValidationState] =
    useState<PasswordValidationState>({
      isValid: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false,
      hasMinLength: false,
      errorMessage: null,
      strength: "weak",
    });

  // Track if we've started typing
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Debounce the password value to avoid excessive validation
  const debouncedPassword = useDebounce(password, debounceMs);

  // Effect to detect when user starts typing
  useEffect(() => {
    if (password && !hasStartedTyping) {
      setHasStartedTyping(true);
    }
  }, [password, hasStartedTyping]);

  // Validation logic
  const validatePassword = () => {
    // Skip validation for empty password
    if (!password) {
      setValidationState({
        isValid: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasMinLength: false,
        errorMessage: null,
        strength: "weak",
      });
      return;
    }

    // Check requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );
    const hasMinLength = password.length >= minLength;

    // Calculate password strength
    let strength: "weak" | "medium" | "strong" = "weak";
    let metRequirements = 0;

    if (hasUppercase) metRequirements++;
    if (hasNumber) metRequirements++;
    if (hasSpecialChar) metRequirements++;
    if (hasMinLength) metRequirements++;

    if (metRequirements >= 4) {
      strength = "strong";
    } else if (metRequirements >= 2) {
      strength = "medium";
    }

    // Determine if password is valid (meets all requirements)
    const isValid = hasUppercase && hasNumber && hasSpecialChar && hasMinLength;

    // Create appropriate error message
    let errorMessage = null;
    if (!isValid && hasStartedTyping) {
      const missingRequirements = [];
      if (!hasMinLength)
        missingRequirements.push(`at least ${minLength} characters`);
      if (!hasUppercase) missingRequirements.push("an uppercase letter");
      if (!hasNumber) missingRequirements.push("a number");
      if (!hasSpecialChar) missingRequirements.push("a special character");

      if (missingRequirements.length > 0) {
        errorMessage = `Password must include ${missingRequirements.join(
          ", "
        )}`;
      }
    }

    setValidationState({
      isValid,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      hasMinLength,
      errorMessage,
      strength,
    });
  };

  // Effect for real-time validation (without full debounce)
  useEffect(() => {
    // Do a quick check for visual feedback, but don't show error messages yet
    if (password) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
        password
      );
      const hasMinLength = password.length >= minLength;

      let strength: "weak" | "medium" | "strong" = "weak";
      let metRequirements = 0;

      if (hasUppercase) metRequirements++;
      if (hasNumber) metRequirements++;
      if (hasSpecialChar) metRequirements++;
      if (hasMinLength) metRequirements++;

      if (metRequirements >= 4) {
        strength = "strong";
      } else if (metRequirements >= 2) {
        strength = "medium";
      }

      setValidationState((prev) => ({
        ...prev,
        hasUppercase,
        hasNumber,
        hasSpecialChar,
        hasMinLength,
        isValid: hasUppercase && hasNumber && hasSpecialChar && hasMinLength,
        strength,
      }));
    }
  }, [password, minLength]);

  // Effect for debounced validation - only show error messages after typing has paused
  useEffect(() => {
    if (debouncedPassword && hasStartedTyping) {
      validatePassword();
    }
  }, [debouncedPassword, hasStartedTyping]);

  return validationState;
}
