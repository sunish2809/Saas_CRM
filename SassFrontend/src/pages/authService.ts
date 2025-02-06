import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`; // Update with your backend URL

interface SignUpData {
  email: string;
  password: string;
  name: string;
  businessType: string;
}

interface SignInData {
  email: string;
  password: string;
  businessType: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    businessType: string;
  };
  message: string;
}

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async signIn(data: SignInData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/signin`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
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
  },

  getToken() {
    return localStorage.getItem('token');
  }
};