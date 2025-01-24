import { api } from '@/lib/axios';

const studyRoomService = {
  // Create a new study room
  async createRoom(participants: string[]) {
    const response = await api.post('/rooms', {
      id: Date.now(),
      participants,
      progress: 0
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
  },

  async getUserActiveRoom(userEmail: string) {
    try {
      const response = await api.get(`/rooms/user/${userEmail}/active`);
      return response.data;
    } catch (error) {
      console.error('Error in getUserActiveRoom:', error);
      throw error;
    }
  }
};

export default studyRoomService;
