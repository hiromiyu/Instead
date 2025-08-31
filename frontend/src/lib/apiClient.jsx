import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASEURL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    toast.error('通信エラーが発生しました。');
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    toast.error('通信エラーが発生しました。');
    return Promise.reject(error);
  }
);

export default apiClient;
