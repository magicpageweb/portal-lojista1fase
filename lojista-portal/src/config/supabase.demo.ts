/**
 * Fallback demo — chave anon/publishable (pública no browser; protegida por RLS).
 * Usado quando VITE_* não estiver definido no build (ex.: Vercel sem env vars).
 */
export const SUPABASE_DEMO = {
  url: "https://finkazcfuadukylmrqyh.supabase.co",
  publishableKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbmthemNmdWFkdWt5bG1ycXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NzUyNzIsImV4cCI6MjA5ODA1MTI3Mn0.eNXzIEs4WPHLQugeFY0rh2hBHsQBOQ0f79KFYirUxpk",
  projectId: "finkazcfuadukylmrqyh",
} as const;
