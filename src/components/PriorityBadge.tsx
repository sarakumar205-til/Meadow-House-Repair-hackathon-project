import React from "react";
import { JobPriority } from "../types/job";
import { AlertTriangleIcon } from "./Icons";

interface PriorityBadgeProps {
  priority: JobPriority;
}

/**
 * PriorityBadge explicitly writes the word "Urgent" or "Normal" in high-contrast text.
 * Strictly adheres to accessibility requirements (does not rely on colour alone).
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  if (priority === "Urgent") {
    return (
      <span className="badge badge-urgent" aria-label="Priority: Urgent">
        <AlertTriangleIcon size={14} className="badge-icon" />
        <span className="badge-text-bold">Urgent</span>
      </span>
    );
  }

  return (
    <span className="badge badge-normal" aria-label="Priority: Normal">
      <span className="badge-text">Normal</span>
    </span>
  );
};\n