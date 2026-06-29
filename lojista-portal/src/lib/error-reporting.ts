export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  // Safe local error logging (console only in development, no telemetries)
  if (import.meta.env.DEV) {
    console.error("[Error Report]:", error, context);
  }
}
