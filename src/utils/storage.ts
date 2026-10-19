import { MaintenanceJob } from "../types/job";

export const STORAGE_KEY = "meadow_house_repairs_jobs_v1";

/**
 * Type guard to verify loaded object matches MaintenanceJob schema.
 */
function isValidJob(obj: unknown): obj is MaintenanceJob {
  if (!obj || typeof obj !== "object") return false;
  const j = obj as Record<string, unknown>;
  return (
    typeof j.id === "string" &&
    typeof j.description === "string" &&
    typeof j.reporter === "string" &&
    j.home === "Meadow House" &&
    (j.priority === "Normal" || j.priority === "Urgent") &&
    (j.status === "New" || j.status === "In Progress" || j.status === "Completed") &&
    typeof j.createdAt === "string" &&
    Array.isArray(j.history)
  );
}

/**
 * Loads saved jobs from localStorage.
 * Handles missing or invalid data gracefully without crashing.
 * Returns empty array by default (no seed data per competition rule).
 */
export function loadJobsFromStorage(): MaintenanceJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(isValidJob);
    }
    return [];
  } catch (error) {
    console.error("Failed to load jobs from localStorage:", error);
    return [];
  }
}

/**
 * Persists the entire jobs array to localStorage.
 */
export function saveJobsToStorage(jobs: MaintenanceJob[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error("Failed to save jobs to localStorage:", error);
  }
}

/**
 * Clears jobs in localStorage for judging reset.
 */
export function clearJobsStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}
