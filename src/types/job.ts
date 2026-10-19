export type JobPriority = "Normal" | "Urgent";
export type JobStatus = "New" | "In Progress" | "Completed";

export interface HistoryEntry {
  id: string;
  status: JobStatus;
  note?: string;
  timestamp: string; // ISO 8601 string
}

export interface MaintenanceJob {
  id: string;
  description: string;
  reporter: string;
  home: "Meadow House";
  priority: JobPriority;
  status: JobStatus;
  createdAt: string; // ISO 8601 string
  latestNote?: string;
  history: HistoryEntry[];
}

export interface ReportFormData {
  description: string;
  reporter: string;
  priority: JobPriority;
}

export interface ValidationErrors {
  description?: string;
  reporter?: string;
  completionNote?: string;
}

export type StatusFilter = "All" | JobStatus | "Urgent";
