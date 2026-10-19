import React, { useState, useMemo } from "react";
import { MaintenanceJob, StatusFilter } from "../types/job";
import { JobCard } from "./JobCard";
import { EmptyState } from "./EmptyState";
import { WrenchIcon } from "./Icons";

interface JobListProps {
  jobs: MaintenanceJob[];
  currentFilter: StatusFilter;
  onSelectFilter: (filter: StatusFilter) => void;
  onOpenJob: (job: MaintenanceJob) => void;
  onOpenReportModal: () => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  currentFilter,
  onSelectFilter,
  onOpenJob,
  onOpenReportModal
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Filter by Status or Urgent Priority
      let matchesCategory = true;
      if (currentFilter === "Urgent") {
        matchesCategory = job.priority === "Urgent";
      } else if (currentFilter !== "All") {
        matchesCategory = job.status === currentFilter;
      }

      if (!matchesCategory) return false;

      // Filter by Search Query
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        job.id.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.reporter.toLowerCase().includes(q) ||
        (job.latestNote && job.latestNote.toLowerCase().includes(q))
      );
    });
  }, [jobs, currentFilter, searchTerm]);

  if (jobs.length === 0) {
    return <EmptyState onOpenReportModal={onOpenReportModal} />;
  }

  const filterTabs: StatusFilter[] = ["All", "New", "In Progress", "Completed", "Urgent"];

  return (
    <div className="job-list-container" role="region" aria-label="Maintenance Jobs List">
      <div className="job-list-controls">
        <div className="filter-tabs" role="tablist" aria-label="Filter jobs by status or urgency">
          {filterTabs.map((tab) => {
            const isSelected = currentFilter === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isSelected}
                className={`filter-tab ${isSelected ? "filter-tab-active" : ""}`}
                onClick={() => onSelectFilter(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="search-bar-wrapper">
          <label htmlFor="job-search-input" className="sr-only">
            Search jobs by ID, description, or reporter
          </label>
          <input
            id="job-search-input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search repairs by description, ID, reporter..."
            className="input-field search-input"
            aria-label="Search repairs"
          />
        </div>
      </div>

      <div className="job-list-count" aria-live="polite">
        Showing <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? "repair job" : "repair jobs"}
        {currentFilter !== "All" && ` (${currentFilter})`}
      </div>

      {filteredJobs.length === 0 ? (
        <EmptyState
          onOpenReportModal={onOpenReportModal}
          isFiltered={true}
          onClearFilter={() => {
            onSelectFilter("All");
            setSearchTerm("");
          }}
        />
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onOpenJob={onOpenJob} />
          ))}
        </div>
      )}
    </div>
  );
};\n