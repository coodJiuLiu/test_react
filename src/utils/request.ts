// src/utils/request.ts
import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

const service: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    if (res.code !== 200) {
      message.error(res.message || 'Error');
      return Promise.reject(new Error(res.message || 'Error'));
    }

    return res;
  },
  (error) => {
    let msg = '网络错误';

    if (error.response) {
      switch (error.response.status) {
        case 401:
          msg = '未授权，请重新登录';
          break;
        case 403:
          msg = '拒绝访问';
          break;
        case 404:
          msg = '请求地址出错';
          break;
        case 500:
          msg = '服务器内部错误';
          break;
        default:
          msg = `连接错误 ${error.response.status}`;
      }
    } else if (error.message?.includes('timeout')) {
      msg = '请求超时';
    }

    message.error(msg);
    return Promise.reject(error);
  }
);

export default service;
