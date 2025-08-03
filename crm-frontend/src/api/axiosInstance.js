// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  // headers: { Authorization: `Bearer ${token}` } — for future when you re-enable auth
});

export default axiosInstance;
