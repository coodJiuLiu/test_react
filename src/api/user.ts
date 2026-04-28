import request from '@/utils/request';

export type UserRole = 'Admin' | 'User' | 'Guest';
export type UserStatus = 'Active' | 'Inactive';

export interface UserRecord {
  key: string;
  name: string;
  age: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  address: string;
}

export interface UserListResult {
  code: number;
  message: string;
  data: UserRecord[];
}

export interface UserMutationResult {
  code: number;
  message: string;
  data: UserRecord;
}

export type UserPayload = Omit<UserRecord, 'key'>;

export function getUserList() {
  return request.get<UserListResult, UserListResult>('/users');
}

export function createUser(data: UserPayload) {
  return request.post<UserMutationResult, UserMutationResult>('/users', data);
}

export function updateUser(key: string, data: UserPayload) {
  return request.put<UserMutationResult, UserMutationResult>(`/users/${key}`, data);
}

export function deleteUser(key: string) {
  return request.delete<{ code: number; message: string }, { code: number; message: string }>(`/users/${key}`);
}
