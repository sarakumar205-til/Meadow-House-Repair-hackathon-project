import React, { useState, useEffect, useRef } from "react";
import { JobPriority, MaintenanceJob, ValidationErrors } from "../types/job";
import { validateReportForm } from "../utils/validation";
import { generateJobId, generateHistoryId } from "../utils/idGenerator";
import { XIcon, HomeIcon } from "./Icons";

interface ReportFaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveJob: (newJob: MaintenanceJob) => void;
  existingJobs: MaintenanceJob[];
}

export const ReportFaultModal: React.FC<ReportFaultModalProps> = ({
  isOpen,
  onClose,
  onSaveJob,
  existingJobs
}) => {
  const [description, setDescription] = useState("");
  const [reporter, setReporter] = useState("");
  const [priority, setPriority] = useState<JobPriority>("Normal");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form and errors when modal opens
      setDescription("");
      setReporter("");
      setPriority("Normal");
      setErrors({});
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using trimmed values
    const validation = validateReportForm(description, reporter);

    if (!validation.isValid) {
      // Keep user-entered values intact, set associated errors
      setErrors(validation.errors);
      return;
    }

    const now = new Date().toISOString();
    const newId = generateJobId(existingJobs);

    const newJob: MaintenanceJob = {
      id: newId,
      description: description.trim(),
      reporter: reporter.trim(),
      home: "Meadow House", // Always fixed to Meadow House
      priority,
      status: "New",
      createdAt: now,
      latestNote: undefined,
      history: [
        {
          id: generateHistoryId(),
          status: "New",
          timestamp: now,
          note: `Fault reported by ${reporter.trim()}`
        }
      ]
    };

    onSaveJob(newJob);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="report-modal-title" className="modal-title">
              Report a Fault
            </h2>
            <p className="modal-subtitle">Log a maintenance issue for Meadow House</p>
          </div>
          <div className="modal-header-actions">
            <span className="kbd-badge" title="Press Escape to close" aria-hidden="true">ESC</span>
            <button
              onClick={onClose}
              className="btn-icon"
              aria-label="Close fault report modal"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          {/* Fixed Home Display */}
          <div className="form-group">
            <label className="form-label" htmlFor="fixed-home-name">
              Property Location
            </label>
            <div className="fixed-value-box" id="fixed-home-name" tabIndex={0} aria-label="Property: Meadow House">
              <HomeIcon size={16} className="text-navy" />
              <span className="font-semibold text-slate-800">Meadow House</span>
              <span className="fixed-badge">Fixed</span>
            </div>
            <p className="form-hint">The property is automatically fixed to Meadow House.</p>
          </div>

          {/* Fault Description */}
          <div className="form-group">
            <label htmlFor="fault-description" className="form-label">
              Fault Description <span className="text-required" aria-hidden="true">*</span>
            </label>
            <textarea
              id="fault-description"
              ref={firstInputRef}
              rows={3}
              style={{ resize: "none" }}
              className={`input-field ${errors.description ? "input-error" : ""}`}
              placeholder="e.g. Garden fence damaged by heavy wind"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "desc-error" : undefined}
            />
            {errors.description && (
              <p id="desc-error" className="error-message" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          {/* Reporter Name */}
          <div className="form-group">
            <label htmlFor="reporter-name" className="form-label">
              Reporter Name <span className="text-required" aria-hidden="true">*</span>
            </label>
            <input
              id="reporter-name"
              type="text"
              className={`input-field ${errors.reporter ? "input-error" : ""}`}
              placeholder="e.g. Alex Morgan"
              value={reporter}
              onChange={(e) => {
                setReporter(e.target.value);
                if (errors.reporter) {
                  setErrors((prev) => ({ ...prev, reporter: undefined }));
                }
              }}
              aria-required="true"
              aria-invalid={!!errors.reporter}
              aria-describedby={errors.reporter ? "reporter-error" : undefined}
            />
            {errors.reporter && (
              <p id="reporter-error" className="error-message" role="alert">
                {errors.reporter}
              </p>
            )}
          </div>

          {/* Priority Selector */}
          <fieldset className="form-group">
            <legend className="form-label">Repair Priority</legend>
            <div className="radio-group" role="radiogroup" aria-label="Repair Priority">
              <label className={`radio-card ${priority === "Normal" ? "radio-card-active" : ""}`}>
                <input
                  type="radio"
                  name="priority"
                  value="Normal"
                  checked={priority === "Normal"}
                  onChange={() => setPriority("Normal")}
                  className="sr-only"
                />
                <span className="radio-title">Normal</span>
                <span className="radio-desc">Routine repairs and general upkeep</span>
              </label>

              <label className={`radio-card radio-card-urgent ${priority === "Urgent" ? "radio-card-active-urgent" : ""}`}>
                <input
                  type="radio"
                  name="priority"
                  value="Urgent"
                  checked={priority === "Urgent"}
                  onChange={() => setPriority("Urgent")}
                  className="sr-only"
                />
                <span className="radio-title text-amber font-bold">Urgent</span>
                <span className="radio-desc">Safety hazards, security, or storm damage</span>
              </label>
            </div>
          </fieldset>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
