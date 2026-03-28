import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL||"https://resume-maker-backend-rt1b.onrender.com", // always read from environment variable
  withCredentials: false,                  // allows cookies if needed
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;