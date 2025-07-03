import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:3000 by Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
