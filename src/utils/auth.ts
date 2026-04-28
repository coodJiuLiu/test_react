export interface UserInfo {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

const TOKEN_KEY = 'token';
const USER_INFO_KEY = 'userInfo';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUserInfo(): UserInfo | null {
  const raw = localStorage.getItem(USER_INFO_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}

export function setUserInfo(userInfo: UserInfo) {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
}

export function clearUserInfo() {
  localStorage.removeItem(USER_INFO_KEY);
}

export function hasPermission(permission?: string) {
  if (!permission) {
    return true;
  }

  const userInfo = getUserInfo();
  return userInfo?.permissions.includes(permission) ?? false;
}

export function clearAuth() {
  clearToken();
  clearUserInfo();
}
