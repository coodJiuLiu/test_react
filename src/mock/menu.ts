import type { MockMethod } from 'vite-plugin-mock';

const adminMenus = [
  { key: '/', label: '首页', path: '/', icon: 'home' },
  { key: '/user', label: '用户管理', path: '/user', icon: 'user', permission: 'user:view' },
  { key: '/system-settings', label: '系统设置', path: '/system-settings', icon: 'setting', permission: 'settings:view' },
];

const operatorMenus = [{ key: '/', label: '首页', path: '/', icon: 'home' }];

export default [
  {
    url: '/menu/list',
    method: 'get',
    response: ({ headers }: { headers: Record<string, string> }) => {
      const token = headers.authorization ?? headers.Authorization ?? '';
      const isAdmin = token.includes('admin');

      return {
        code: 200,
        message: '获取菜单成功',
        data: isAdmin ? adminMenus : operatorMenus,
      };
    },
  },
] as MockMethod[];
