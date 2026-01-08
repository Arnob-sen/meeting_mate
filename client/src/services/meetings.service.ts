import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api.config";
import type { Meeting, CreateMeetingRequest } from "@/types/meeting";

// Create axios instance with default headers to bypass ngrok warning page
const apiClient = axios.create({
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export const meetingsService = {
  /**
   * Fetch all meetings
   */
  async getAllMeetings(): Promise<Meeting[]> {
    try {
      const response = await apiClient.get<Meeting[]>(
        API_ENDPOINTS.MEETINGS.GET_ALL
      );

      // Check if response is HTML (ngrok warning page)
      if (
        typeof response.data === "string" &&
        (response.data as string).includes("<!DOCTYPE html>")
      ) {
        console.error(
          "Received HTML instead of JSON. This might be ngrok warning page."
        );
        throw new Error(
          "Received HTML response. Please check ngrok configuration."
        );
      }

      // Ensure we always return an array
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      // Handle case where response might be wrapped in an object
      if (
        data &&
        Array.isArray((data as Record<string, unknown>).data as Meeting[])
      ) {
        return (data as Record<string, unknown>).data as Meeting[];
      }
      // If data is not an array, return empty array
      console.warn("API response is not an array:", data);
      return [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error Details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });

        // Network error (CORS, connection refused, etc.)
        if (!error.response) {
          throw new Error(
            `Network error: ${error.message}. Please check if the backend server is running and CORS is configured correctly.`
          );
        }

        // Check if error response is HTML
        if (
          error.response?.data &&
          typeof error.response.data === "string" &&
          error.response.data.includes("<!DOCTYPE html>")
        ) {
          throw new Error(
            "Received HTML response from server. This might be ngrok warning page. Please check your ngrok configuration."
          );
        }

        throw new Error(
          error.response?.data?.message ||
            `Failed to fetch meetings: ${
              error.response?.statusText || error.message
            }`
        );
      }
      throw error;
    }
  },

  /**
   * Create a new meeting by uploading audio file
   */
  async createMeeting(data: CreateMeetingRequest): Promise<Meeting> {
    try {
      const formData = new FormData();
      formData.append("file", data.file, "recording.webm");
      formData.append("clientName", data.clientName);

      const response = await apiClient.post<Meeting>(
        API_ENDPOINTS.MEETINGS.CREATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to process meeting";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  /**
   * Search meetings semantically
   */
  async searchMeetings(query: string): Promise<Meeting[]> {
    try {
      const response = await apiClient.get<Meeting[]>(
        API_ENDPOINTS.MEETINGS.SEARCH,
        {
          params: { q: query },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    }
  },

  /**
   * Chat with past meetings (RAG)
   */
  async chatWithMeetings(
    query: string
  ): Promise<{ answer: string; sources: string[] }> {
    try {
      const response = await apiClient.post<{
        answer: string;
        sources: string[];
      }>(
        API_ENDPOINTS.MEETINGS.CHAT,
        { query },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Chat failed:", error);
      throw error;
    }
  },
};
