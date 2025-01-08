import { api } from '@/lib/axios';

const API_URL = 'http://localhost:5000/api/auth';

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  skillToTeach: string;
  skillToLearn: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  fullName?: string;
  skillToTeach?: string;
  skillToLearn?: string;
  password?: string;
}

const authService = {
  async signup(data: SignupData) {
    const response = await api.post('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async updateProfile(data: UpdateProfileData) {
    const response = await api.put('/auth/profile', data);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};

export default authService;
