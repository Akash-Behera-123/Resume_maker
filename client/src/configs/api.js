import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // always read from environment variable
  withCredentials: true,                  // allows cookies if needed
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;