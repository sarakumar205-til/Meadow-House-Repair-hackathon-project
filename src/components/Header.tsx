import React from "react";
import { PlusIcon, HomeIcon, RefreshIcon } from "./Icons";

interface HeaderProps {
  onOpenReportModal: () => void;
  onResetData: () => void;
  jobCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReportModal,
  onResetData,
  jobCount
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-branding">
          <div className="header-logo-badge" aria-hidden="true">
            <HomeIcon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="header-title">Meadow House Repairs</h1>
            <p className="header-subtitle">
              Report maintenance faults, track repair progress, and record completion for Meadow House
            </p>
          </div>
        </div>

        <div className="header-actions">
          {jobCount > 0 && (
            <button
              onClick={onResetData}
              className="btn btn-secondary btn-sm"
              title="Reset all jobs to an empty state for a fresh judging session"
              aria-label="Reset all saved jobs to a clean empty state"
            >
              <RefreshIcon size={16} />
              <span>Reset State</span>
            </button>
          )}

          <button
            onClick={onOpenReportModal}
            className="btn btn-primary btn-lg pulse-glow"
            aria-label="Report a new maintenance fault"
            id="main-report-fault-btn"
          >
            <PlusIcon size={20} />
            <span>Report a Fault</span>
          </button>
        </div>
      </div>
    </header>
  );
};\n