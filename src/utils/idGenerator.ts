import { MaintenanceJob } from "../types/job";

/**
 * Generates an automatic, unique, non-colliding job ID prefixed with MH-.
 * Does not rely on array index so deletion or rapid creation remains unique.
 */
export function generateJobId(existingJobs: MaintenanceJob[] = []): string {
  const existingIds = new Set(existingJobs.map((j) => j.id));
  
  // Base sequential counter starting at 1001
  let counter = 1001 + existingJobs.length;
  let candidate = `MH-${counter}`;
  
  while (existingIds.has(candidate)) {
    counter++;
    candidate = `MH-${counter}`;
  }
  
  return candidate;
}

/**
 * Generates a unique history entry ID.
 */
export function generateHistoryId(): string {
  return `HIST-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}\n