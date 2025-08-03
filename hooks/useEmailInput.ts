import { useState } from "react";

/**
 * Custom hook for handling email input with validation
 * @param initialValue Initial email value
 * @returns Value and handlers for email input
 */
export function useEmailInput(initialValue: string = "") {
  const [value, setValue] = useState(initialValue);

  /**
   * Handle input changes, allowing only valid email characters
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow only valid email characters
    // This regex allows characters that can be part of a valid email
    if (/^[a-zA-Z0-9@._\-+]*$/.test(newValue) || newValue === "") {
      setValue(newValue.toLowerCase());
    }
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

    // Allow valid email characters
    const isValidChar = /^[a-zA-Z0-9@._\-+]$/.test(e.key);

    // Allow special key combinations (copy, paste, etc.)
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    if (!isValidChar && !allowedKeys.includes(e.key) && !isCtrlOrMeta) {
      e.preventDefault();
    }
  };

  /**
   * Handle paste to filter out invalid characters
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");

    // If pasted text contains invalid characters, prevent default and handle manually
    if (!/^[a-zA-Z0-9@._\-+]*$/.test(pastedText)) {
      e.preventDefault();

      // Filter out invalid characters and set the value
      const filteredText = pastedText
        .replace(/[^a-zA-Z0-9@._\-+]/g, "")
        .toLowerCase();

      // Get current input value and selection
      const input = e.currentTarget;
      const currentValue = input.value;
      const selectionStart = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;

      // Create new value with pasted text inserted at cursor position
      const newValue =
        currentValue.substring(0, selectionStart) +
        filteredText +
        currentValue.substring(selectionEnd);

      // Update the value
      setValue(newValue);

      // Set cursor position after pasted text (needs to be done after render)
      setTimeout(() => {
        const newCursorPosition = selectionStart + filteredText.length;
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  return {
    value,
    setValue,
    handleChange,
    handleKeyDown,
    handlePaste,
  };
}
