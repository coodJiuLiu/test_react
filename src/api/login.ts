// src/api/login.ts
import request from '@/utils/request'; // 引入封装好的 axios 实例

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  code: number;
  message: string;
  data?: {
    token?: string;
    userInfo?: {
      id: string;
      name: string;
      role: string;
      permissions: string[];
    };
  };
}

/**
 * 用户登录
 */
export function login(data: LoginParams) {
  return request.post<LoginResult, LoginResult>('/login', data);
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get('/user/info');
}

/**
 * 退出登录
 */
export function logout() {
  return request.post('/logout');
}
