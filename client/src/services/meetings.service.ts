import axios, { AxiosError } from 'axios';
import { API_ENDPOINTS } from '@/constants/api.config';
import type { Meeting, CreateMeetingRequest } from '@/types/meeting';

export const meetingsService = {
  /**
   * Fetch all meetings
   */
  async getAllMeetings(): Promise<Meeting[]> {
    try {
      const response = await axios.get<Meeting[]>(API_ENDPOINTS.MEETINGS.GET_ALL);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch meetings',
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
      formData.append('file', data.file, 'recording.webm');
      formData.append('clientName', data.clientName);

      const response = await axios.post<Meeting>(
        API_ENDPOINTS.MEETINGS.CREATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to process meeting';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

