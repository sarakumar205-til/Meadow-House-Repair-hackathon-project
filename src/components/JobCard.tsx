import React from "react";
import { MaintenanceJob } from "../types/job";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { formatDateTime } from "../utils/dateUtils";
import { UserIcon, CalendarIcon, ArrowLeftIcon } from "./Icons";

interface JobCardProps {
  job: MaintenanceJob;
  onOpenJob: (job: MaintenanceJob) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onOpenJob }) => {
  return (
    <article className="job-card" aria-labelledby={`job-title-${job.id}`}>
      <div className="job-card-top">
        <div className="job-card-id-group">
          <span className="job-id-tag">{job.id}</span>
          <span className="home-tag">{job.home}</span>
        </div>
        <div className="job-card-badges">
          <PriorityBadge priority={job.status === "Completed" ? "Normal" : job.priority} />
          <StatusBadge status={job.status} />
        </div>
      </div>

      <h3 id={`job-title-${job.id}`} className="job-description">
        {/* Rendered safely as plain text */}
        {job.description}
      </h3>

      <div className="job-card-meta">
        <span className="meta-item">
          <UserIcon size={14} className="meta-icon" />
          <span className="meta-text">{job.reporter}</span>
        </span>
        <span className="meta-item">
          <CalendarIcon size={14} className="meta-icon" />
          <span className="meta-text">{formatDateTime(job.createdAt)}</span>
        </span>
      </div>

      {job.latestNote && (
        <div className="job-card-note-preview">
          <span className="note-preview-label">Latest Note:</span>
          <p className="note-preview-text">{job.latestNote}</p>
        </div>
      )}

      <div className="job-card-footer">
        <button
          onClick={() => onOpenJob(job)}
          className="btn btn-outline btn-block"
          aria-label={`Open repair details for job ${job.id}: ${job.description}`}
        >
          <span>Open Repair</span>
          <span className="rotate-180" aria-hidden="true">
            <ArrowLeftIcon size={16} />
          </span>
        </button>
      </div>
    </article>
  );
};
