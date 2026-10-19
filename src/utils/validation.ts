import { ValidationErrors } from "../types/job";

/**
 * Validates a fault report.
 * Rejects empty or whitespace-only descriptions and reporter names.
 * Returns trimmed validation results without wiping other entered fields.
 */
export function validateReportForm(
  description: string,
  reporter: string
): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};
  const trimmedDesc = description.trim();
  const trimmedReporter = reporter.trim();

  if (trimmedDesc.length === 0) {
    errors.description = "Fault description is required and cannot be blank or spaces only.";
  }

  if (trimmedReporter.length === 0) {
    errors.reporter = "Reporter name is required and cannot be blank or spaces only.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates the completion note when setting a job to Completed.
 * Must be non-empty and not just spaces.
 */
export function validateCompletionNote(note: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = note.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: "A completion note is required before marking this repair as Completed."
    };
  }
  return { isValid: true };
}\n