import React from "react";

export interface PasswordChangeStatusProps {
  status: "success" | "error" | "pending";
  message?: string;
}

export const PasswordChangeStatus: React.FC<PasswordChangeStatusProps> = ({
  status,
  message = "",
}) => {
  return (
    <div className="password-change-status">
      <div className={`status-container ${status}`}>
        <h3>
          {status === "success"
            ? "Success"
            : status === "error"
            ? "Error"
            : "Processing"}
        </h3>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};
