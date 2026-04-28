import request from '@/utils/request';

export interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon: 'home' | 'user' | 'setting';
  permission?: string;
}

export interface MenuListResult {
  code: number;
  message: string;
  data: MenuItem[];
}

export function getMenuList() {
  return request.get<MenuListResult, MenuListResult>('/menu/list');
}
