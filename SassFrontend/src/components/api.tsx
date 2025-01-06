import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const api = axios.create({
    baseURL: 'http://localhost:3000/api'
  });

  api.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  });

  return api;
};