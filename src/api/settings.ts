import request from '@/utils/request';

export interface BasicSettings {
  siteName: string;
  language: string;
  theme: string;
  itemsPerPage: number;
}

export interface NotificationSettings {
  emailNotice: boolean;
  smsNotice: boolean;
  siteNotice: boolean;
}

export interface SettingsData {
  basic: BasicSettings;
  notifications: NotificationSettings;
}

export interface SettingsResult {
  code: number;
  message: string;
  data: SettingsData;
}

export function getSettings() {
  return request.get<SettingsResult, SettingsResult>('/settings');
}

export function saveBasicSettings(data: BasicSettings) {
  return request.post<{ code: number; message: string }, { code: number; message: string }>('/settings/basic', data);
}

export function saveNotificationSettings(data: NotificationSettings) {
  return request.post<{ code: number; message: string }, { code: number; message: string }>('/settings/notifications', data);
}

export function changePassword(data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return request.post<{ code: number; message: string }, { code: number; message: string }>('/settings/password', data);
}
