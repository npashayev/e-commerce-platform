import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default apiClient;
