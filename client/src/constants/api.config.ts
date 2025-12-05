const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  MEETINGS: {
    BASE: `${API_BASE_URL}/api/meetings`,
    GET_ALL: `${API_BASE_URL}/api/meetings`,
    CREATE: `${API_BASE_URL}/api/meetings`,
  },
} as const;

