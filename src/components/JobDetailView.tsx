import React, { useState } from "react";
import { MaintenanceJob, JobStatus } from "../types/job";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { HistoryTimeline } from "./HistoryTimeline";
import { formatDateTime } from "../utils/dateUtils";
import { validateCompletionNote } from "../utils/validation";
import { generateHistoryId } from "../utils/idGenerator";
import { ArrowLeftIcon, UserIcon, CalendarIcon, HomeIcon, CheckCircleIcon } from "./Icons";

interface JobDetailViewProps {
  job: MaintenanceJob;
  onBack: () => void;
  onUpdateJob: (updatedJob: MaintenanceJob) => void;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({
  job,
  onBack,
  onUpdateJob
}) => {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>(
    job.status === "New" ? "In Progress" : job.status
  );
  const [updateNote, setUpdateNote] = useState("");
  const [completionError, setCompletionError] = useState<string | null>(null);

  const handleStatusChange = (newStatus: JobStatus) => {
    setSelectedStatus(newStatus);
    if (completionError && newStatus !== "Completed") {
      setCompletionError(null);
    }
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    // Mandatory Rule: If status is Completed, note must not be blank or spaces-only
    if (selectedStatus === "Completed") {
      const validation = validateCompletionNote(updateNote);
      if (!validation.isValid) {
        // Reject completion: do NOT change status, do NOT overwrite notes, do NOT append history
        setCompletionError(validation.error || "A completion note is required.");
        return;
      }
    }

    // Check if anything is actually changing
    const trimmedNote = updateNote.trim();
    if (selectedStatus === job.status && trimmedNote.length === 0) {
      setCompletionError("Please select a new status or provide an update note.");
      return;
    }

    const now = new Date().toISOString();
    const newHistoryEntry = {
      id: generateHistoryId(),
      status: selectedStatus,
      timestamp: now,
      note: trimmedNote.length > 0 ? trimmedNote : undefined
    };

    // Update only the selected job; mark done tasks as not urgent
    const updatedJob: MaintenanceJob = {
      ...job,
      status: selectedStatus,
      priority: selectedStatus === "Completed" ? "Normal" : job.priority,
      latestNote: trimmedNote.length > 0 ? trimmedNote : job.latestNote,
      history: [...job.history, newHistoryEntry]
    };

    onUpdateJob(updatedJob);
    setUpdateNote("");
    setCompletionError(null);
  };

  const isCompleted = job.status === "Completed";

  return (
    <div className="job-detail-container" role="main" aria-label={`Job details for ${job.id}`}>
      {/* Top Navigation */}
      <div className="detail-top-bar">
        <button
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          aria-label="Return to job list without losing saved data"
        >
          <ArrowLeftIcon size={16} />
          <span>Back to Job List</span>
        </button>
        <div className="detail-top-badges">
          <span className="job-id-pill">{job.id}</span>
          <PriorityBadge priority={isCompleted ? "Normal" : job.priority} />
          <StatusBadge status={job.status} />
        </div>
      </div>

      <div className="detail-grid">
        {/* Left Column: Job Info & Update Controls */}
        <div className="detail-left-col">
          {/* Main Info Card */}
          <div className="detail-card">
            <div className="detail-header">
              <span className="detail-eyebrow">Maintenance Fault</span>
              <h2 className="detail-fault-title">{job.description}</h2>
            </div>

            <div className="detail-meta-grid">
              <div className="meta-box">
                <span className="meta-box-label">Property</span>
                <span className="meta-box-value">
                  <HomeIcon size={16} className="text-navy inline-icon" />
                  {job.home}
                </span>
              </div>
              <div className="meta-box">
                <span className="meta-box-label">Reported By</span>
                <span className="meta-box-value">
                  <UserIcon size={16} className="text-navy inline-icon" />
                  {job.reporter}
                </span>
              </div>
              <div className="meta-box">
                <span className="meta-box-label">Date Reported</span>
                <span className="meta-box-value">
                  <CalendarIcon size={16} className="text-navy inline-icon" />
                  {formatDateTime(job.createdAt)}
                </span>
              </div>
              <div className="meta-box">
                <span className="meta-box-label">Current Priority</span>
                <span className="meta-box-value">
                  <PriorityBadge priority={isCompleted ? "Normal" : job.priority} />
                </span>
              </div>
            </div>

            {/* Latest Saved Note Display */}
            <div className="latest-note-card">
              <span className="latest-note-eyebrow">Latest Saved Note</span>
              {job.latestNote ? (
                <p className="latest-note-text">{job.latestNote}</p>
              ) : (
                <p className="latest-note-empty">No notes recorded yet.</p>
              )}
            </div>

            {/* Completed state highlight */}
            {isCompleted && (
              <div className="completed-banner" role="status">
                <CheckCircleIcon size={20} className="text-emerald" />
                <div>
                  <h4 className="completed-banner-title">Repair Completed</h4>
                  <p className="completed-banner-text">
                    Completion explanation: <strong>{job.latestNote || "Repair resolved."}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Update Progress & Status Form */}
          <div className="detail-card update-controls-card">
            <h3 className="section-title">Update Progress & Change Status</h3>
            <p className="section-subtitle">
              Record maintenance actions, add progress notes, or mark this repair as completed.
            </p>

            <form onSubmit={handleSaveUpdate} noValidate className="update-form">
              <div className="form-group">
                <label className="form-label">Select Repair Status</label>
                <div className="status-selector-grid" role="radiogroup" aria-label="Change status">
                  {(["In Progress", "Completed"] as JobStatus[]).map((st) => {
                    const isSelected = selectedStatus === st;
                    return (
                      <button
                        type="button"
                        key={st}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleStatusChange(st)}
                        className={`status-select-btn ${isSelected ? `status-select-btn-active-${st.toLowerCase().replace(" ", "-")}` : ""}`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="update-note" className="form-label">
                  {selectedStatus === "Completed" ? (
                    <span>
                      Completion Note <span className="text-required">*</span> (Required for completion)
                    </span>
                  ) : (
                    <span>Progress Note (Optional)</span>
                  )}
                </label>
                <textarea
                  id="update-note"
                  rows={3}
                  style={{ resize: "none" }}
                  className={`input-field ${completionError ? "input-error" : ""}`}
                  placeholder={
                    selectedStatus === "Completed"
                      ? "e.g. Fence repaired and checked. All panels secure."
                      : "e.g. Temporary barrier fitted, awaiting replacement timber..."
                  }
                  value={updateNote}
                  onChange={(e) => {
                    setUpdateNote(e.target.value);
                    if (completionError) setCompletionError(null);
                  }}
                  aria-invalid={!!completionError}
                  aria-describedby={completionError ? "completion-error-msg" : undefined}
                />
                {completionError && (
                  <p id="completion-error-msg" className="error-message" role="alert">
                    {completionError}
                  </p>
                )}
              </div>

              <div className="update-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="save-update-btn"
                >
                  Save Update
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Full Chronological History */}
        <div className="detail-right-col">
          <div className="detail-card history-container-card">
            <h3 className="section-title">Complete Chronological History</h3>
            <p className="section-subtitle">
              Every status change and note is timestamped and permanently preserved.
            </p>
            <HistoryTimeline history={job.history} />
          </div>
        </div>
      </div>
    </div>
  );
};
