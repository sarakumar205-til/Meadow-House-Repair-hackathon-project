import React from "react";
import { WrenchIcon, PlusIcon } from "./Icons";

interface EmptyStateProps {
  onOpenReportModal: () => void;
  isFiltered?: boolean;
  onClearFilter?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenReportModal,
  isFiltered,
  onClearFilter
}) => {
  return (
    <div className="empty-state-card" role="region" aria-label="No jobs found">
      <div className="empty-state-icon-box" aria-hidden="true">
        <WrenchIcon size={36} className="text-slate-400" />
      </div>
      <h3 className="empty-state-title">
        {isFiltered ? "No matching repair jobs" : "No maintenance jobs reported yet"}
      </h3>
      <p className="empty-state-text">
        {isFiltered
          ? "There are currently no maintenance jobs matching your selected filter."
          : "Meadow House has no logged repairs. Use the button below to report a new fault, such as storm-damaged garden fencing or lighting issues."}
      </p>
      <div className="empty-state-actions">
        {isFiltered && onClearFilter && (
          <button
            onClick={onClearFilter}
            className="btn btn-secondary"
            aria-label="Clear active filter"
          >
            Show All Jobs
          </button>
        )}
        <button
          onClick={onOpenReportModal}
          className="btn btn-primary"
          aria-label="Report a Fault now"
        >
          <PlusIcon size={18} />
          <span>Report a Fault</span>
        </button>
      </div>
    </div>
  );
};
