import { useState, useEffect } from "react";

/**
 * Custom hook for handling phone number input with formatting
 * @param initialValue Initial phone number value
 * @returns Formatted value, raw value, and handlers
 */
export function usePhoneInput(initialValue: string = "") {
  const [rawValue, setRawValue] = useState(initialValue);
  const [formattedValue, setFormattedValue] = useState(initialValue);

  // Format the phone number whenever the raw value changes
  useEffect(() => {
    formatPhoneNumber(rawValue);
  }, [rawValue]);

  /**
   * Format a phone number with proper spacing and ensure it starts with +
   */
  const formatPhoneNumber = (value: string) => {
    // If empty, just use a plus sign as starting point
    if (!value) {
      setFormattedValue("+");
      return;
    }

    // Ensure the number starts with +
    let formatted = value.startsWith("+") ? value : "+" + value;

    // Remove any non-digit characters except the leading +
    formatted = "+" + formatted.substring(1).replace(/[^\d]/g, "");

    // Add spaces for readability after country code and area code
    // This is a simple implementation that works for many formats
    if (formatted.length > 4) {
      // Add space after country code (assuming 1-3 digits)
      const countryCodeEnd = Math.min(4, formatted.length);
      let result = formatted.substring(0, countryCodeEnd);

      // Add the rest with spaces every 3 digits for readability
      const remaining = formatted.substring(countryCodeEnd);
      for (let i = 0; i < remaining.length; i += 3) {
        const chunk = remaining.substring(i, Math.min(i + 3, remaining.length));
        if (chunk) {
          result += " " + chunk;
        }
      }

      formatted = result;
    }

    setFormattedValue(formatted);
  };

  /**
   * Handle input changes, preserving the cursor position
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;

    // If backspacing from just "+", keep the +
    if (newValue === "") {
      setRawValue("+");
      return;
    }

    // Remove non-digit characters for the raw value (except the leading +)
    let cleaned = newValue.startsWith("+") ? "+" : "";
    cleaned += newValue.replace(/[^\d+]/g, "").replace(/^\+/, "");

    setRawValue(cleaned);
  };

  /**
   * Handle key down to prevent invalid characters
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, ctrl+A, ctrl+C, ctrl+V, ctrl+X, home, end, arrows
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "Home",
      "End",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];

    // Allow digits and + (only at the beginning)
    const isDigit = /\d/.test(e.key);
    const isPlusAtStart = e.key === "+" && e.currentTarget.selectionStart === 0;

    // Allow special key combinations (copy, paste, etc.)
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    if (
      !isDigit &&
      !isPlusAtStart &&
      !allowedKeys.includes(e.key) &&
      !isCtrlOrMeta
    ) {
      e.preventDefault();
    }
  };

  return {
    value: formattedValue,
    rawValue,
    handleChange,
    handleKeyDown,
    setValue: setRawValue,
  };
}
