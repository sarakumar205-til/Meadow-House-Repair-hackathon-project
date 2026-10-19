/**
 * Formats an ISO date string into a clear, readable UK format (e.g., 19 Oct 2026, 14:30).
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } catch {
    return isoString;
  }
}

/**
 * Formats a date for compact display (e.g., 19 Oct 2026).
 */
export function formatDateOnly(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return isoString;
  }
}
