import React, { useEffect } from "react";
import { CheckCircleIcon, AlertTriangleIcon, XIcon } from "./Icons";

export interface ToastMessage {
  id: string;
  type: "success" | "error";
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast-container ${isSuccess ? "toast-success" : "toast-error"}`}
    >
      <div className="toast-content">
        {isSuccess ? (
          <CheckCircleIcon size={20} className="toast-icon text-emerald" />
        ) : (
          <AlertTriangleIcon size={20} className="toast-icon text-amber" />
        )}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="toast-close-btn"
        aria-label="Dismiss notification"
      >
        <XIcon size={16} />
      </button>
    </div>
  );
};
