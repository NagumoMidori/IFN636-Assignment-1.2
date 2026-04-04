import axios from 'axios';

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';
const baseURL = isProduction
  ? process.env.REACT_APP_API_BASE_URL_PROD || 'http://13.236.86.127:5001'
  : process.env.REACT_APP_API_BASE_URL_DEV || 'http://localhost:5001';

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
