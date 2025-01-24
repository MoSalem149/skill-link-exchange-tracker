import { api } from '@/lib/axios';

const studyRoomService = {
  // Create a new study room
  async createRoom(participants: string[]) {
    const response = await api.post('/rooms', {
      id: Date.now(),
      participants
    });
    return response.data;
  },

  // Get room details
  async getRoom(roomId: string) {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },

  // Update room progress
  async updateProgress(roomId: string, progress: number) {
    const response = await api.put(`/rooms/${roomId}/progress`, {
      progress
    });
    return response.data;
  }
};

export default studyRoomService;
