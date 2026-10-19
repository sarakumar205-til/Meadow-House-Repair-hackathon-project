import React from "react";
import { MaintenanceJob, StatusFilter } from "../types/job";
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon, WrenchIcon } from "./Icons";

interface SummaryCardsProps {
  jobs: MaintenanceJob[];
  currentFilter: StatusFilter;
  onSelectFilter: (filter: StatusFilter) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  jobs,
  currentFilter,
  onSelectFilter
}) => {
  const total = jobs.length;
  const newCount = jobs.filter((j) => j.status === "New").length;
  const inProgressCount = jobs.filter((j) => j.status === "In Progress").length;
  const completedCount = jobs.filter((j) => j.status === "Completed").length;
  const urgentCount = jobs.filter((j) => j.priority === "Urgent").length;

  const cards = [
    {
      id: "All" as StatusFilter,
      label: "Total Jobs",
      count: total,
      icon: <WrenchIcon size={20} className="text-navy" />,
      aria: `Filter all ${total} jobs`
    },
    {
      id: "New" as StatusFilter,
      label: "New",
      count: newCount,
      icon: <WrenchIcon size={20} className="text-blue" />,
      aria: `Filter ${newCount} new jobs`
    },
    {
      id: "In Progress" as StatusFilter,
      label: "In Progress",
      count: inProgressCount,
      icon: <ClockIcon size={20} className="text-royal" />,
      aria: `Filter ${inProgressCount} in-progress jobs`
    },
    {
      id: "Completed" as StatusFilter,
      label: "Completed",
      count: completedCount,
      icon: <CheckCircleIcon size={20} className="text-emerald" />,
      aria: `Filter ${completedCount} completed jobs`
    },
    {
      id: "Urgent" as StatusFilter,
      label: "Urgent",
      count: urgentCount,
      icon: <AlertTriangleIcon size={20} className="text-amber" />,
      aria: `Filter ${urgentCount} urgent jobs`
    }
  ];

  return (
    <section className="summary-section" aria-label="Job Statistics Overview">
      <div className="summary-grid">
        {cards.map((c) => {
          const isActive = currentFilter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectFilter(c.id)}
              className={`summary-card ${isActive ? "summary-card-active" : ""}`}
              aria-label={c.aria}
              aria-pressed={isActive}
            >
              <div className="summary-card-header">
                <span className="summary-card-label">{c.label}</span>
                {c.icon}
              </div>
              <div className="summary-card-count">{c.count}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
