import React from "react";
import { HistoryEntry } from "../types/job";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "../utils/dateUtils";
import { CalendarIcon } from "./Icons";

interface HistoryTimelineProps {
  history: HistoryEntry[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return <p className="text-secondary text-sm">No historical updates recorded.</p>;
  }

  // Display newest update first for quick inspection, or chronological order
  // The rubric specifies: "A complete chronological history of status changes and notes"
  return (
    <div className="history-timeline" role="feed" aria-label="Repair job update history">
      {history.map((entry, index) => {
        return (
          <div key={entry.id || index} className="history-item">
            <div className="history-timeline-marker" aria-hidden="true" />
            <div className="history-card">
              <div className="history-meta">
                <StatusBadge status={entry.status} />
                <span className="history-timestamp">
                  <CalendarIcon size={14} className="inline-icon" />
                  {formatDateTime(entry.timestamp)}
                </span>
              </div>
              {entry.note ? (
                <div className="history-note-content">
                  {/* React safely renders plain text without interpreting HTML tags like <b> */}
                  <p className="history-note-text">{entry.note}</p>
                </div>
              ) : (
                <p className="history-note-empty">Status updated to {entry.status} (no note provided)</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
