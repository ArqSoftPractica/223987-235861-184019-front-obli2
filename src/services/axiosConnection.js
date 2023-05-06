import axios from 'axios';

// create an axios instance with default configuration
const config = {
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
};

const instance = axios.create(config);

instance.interceptors.request.use(function (config) {
  if ("development" === process.env.NODE_ENV) console.log('Request:', config);
  return config;
}, function (error) {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  if ("development" === process.env.NODE_ENV) console.log('Response:', response);
  return response;
}, function (error) {
  console.error('Response Error:', error);
  return Promise.reject(error);
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;