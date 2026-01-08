// API Base URL Configuration
// For local development: 'http://localhost:8000'
// For ngrok testing: Set NEXT_PUBLIC_API_URL in .env.local to your ngrok backend URL
// Example: NEXT_PUBLIC_API_URL=https://15aea2bb5414.ngrok-free.app
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  MEETINGS: {
    BASE: `${API_BASE_URL}/api/meetings`,
    GET_ALL: `${API_BASE_URL}/api/meetings`,
    CREATE: `${API_BASE_URL}/api/meetings`,
    SEARCH: `${API_BASE_URL}/api/meetings/search`,
    CHAT: `${API_BASE_URL}/api/meetings/chat`,
  },
} as const;
