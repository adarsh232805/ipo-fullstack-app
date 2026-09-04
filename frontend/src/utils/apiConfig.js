// Auto-detect production vs development API endpoint
export const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }
  // In production browser (e.g. Vercel deployed URL on mobile or desktop)
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return window.location.origin;
  }
  // Local development fallback
  return "http://localhost:5000";
};

export const API_BASE_URL = getApiBase();
export const API_URL = `${getApiBase()}/api`;

