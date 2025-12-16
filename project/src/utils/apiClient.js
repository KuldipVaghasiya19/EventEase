import axios from 'axios';

// Set the base URL to your Spring Boot backend port (8082)
const API_BASE_URL = 'http://localhost:8082/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // CRUCIAL: Enables sending and receiving cookies (JSESSIONID)
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;