import React from "react";
import { JobStatus } from "../types/job";
import { ClockIcon, CheckCircleIcon, WrenchIcon } from "./Icons";

interface StatusBadgeProps {
  status: JobStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (status === "Completed") {
    return (
      <span className="badge badge-completed" aria-label="Status: Completed">
        <CheckCircleIcon size={14} className="badge-icon" />
        <span>Completed</span>
      </span>
    );
  }

  if (status === "In Progress") {
    return (
      <span className="badge badge-in-progress" aria-label="Status: In Progress">
        <ClockIcon size={14} className="badge-icon" />
        <span>In Progress</span>
      </span>
    );
  }

  return (
    <span className="badge badge-new" aria-label="Status: New">
      <WrenchIcon size={14} className="badge-icon" />
      <span>New</span>
    </span>
  );
};
