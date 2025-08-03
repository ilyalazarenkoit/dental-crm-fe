import React, { useState } from "react";

interface PasswordRecoveryProps {
  onSubmit?: (email: string) => void;
  isLoading?: boolean;
}

export const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    if (onSubmit) {
      onSubmit(email);
    }
  };

  return (
    <div className="password-recovery-container">
      <h2>Password Recovery</h2>
      <p>Enter your email address to receive a password reset link</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {error && <div className="error-message">{error}</div>}
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Sending..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};
