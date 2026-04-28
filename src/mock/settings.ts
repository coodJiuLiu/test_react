import type { MockMethod } from 'vite-plugin-mock';

let settings = {
  basic: {
    siteName: '测试项目系统',
    language: 'zh-CN',
    theme: 'light',
    itemsPerPage: 10,
  },
  notifications: {
    emailNotice: true,
    smsNotice: false,
    siteNotice: true,
  },
};

export default [
  {
    url: '/settings',
    method: 'get',
    response: ({ headers }: { headers: Record<string, string> }) => {
      const token = headers.authorization ?? headers.Authorization ?? '';

      if (!token.includes('admin')) {
        return {
          code: 403,
          message: '无权查看系统设置',
        };
      }

      return {
        code: 200,
        message: '获取系统设置成功',
        data: settings,
      };
    },
  },
  {
    url: '/settings/basic',
    method: 'post',
    response: ({ body, headers }: { body: typeof settings.basic; headers: Record<string, string> }) => {
      const token = headers.authorization ?? headers.Authorization ?? '';

      if (!token.includes('admin')) {
        return {
          code: 403,
          message: '无权修改基本设置',
        };
      }

      settings = {
        ...settings,
        basic: {
          ...body,
          itemsPerPage: Number(body.itemsPerPage),
        },
      };

      return {
        code: 200,
        message: '基本设置保存成功',
      };
    },
  },
  {
    url: '/settings/notifications',
    method: 'post',
    response: ({ body, headers }: { body: typeof settings.notifications; headers: Record<string, string> }) => {
      const token = headers.authorization ?? headers.Authorization ?? '';

      if (!token.includes('admin')) {
        return {
          code: 403,
          message: '无权修改通知设置',
        };
      }

      settings = {
        ...settings,
        notifications: body,
      };

      return {
        code: 200,
        message: '通知设置保存成功',
      };
    },
  },
  {
    url: '/settings/password',
    method: 'post',
    response: ({
      body,
      headers,
    }: {
      body: { oldPassword: string; newPassword: string; confirmPassword: string };
      headers: Record<string, string>;
    }) => {
      const token = headers.authorization ?? headers.Authorization ?? '';

      if (!token.includes('admin')) {
        return {
          code: 403,
          message: '无权修改密码',
        };
      }

      if (body.newPassword !== body.confirmPassword) {
        return {
          code: 400,
          message: '两次输入的新密码不一致',
        };
      }

      if (body.oldPassword !== '123456') {
        return {
          code: 400,
          message: '当前密码错误',
        };
      }

      return {
        code: 200,
        message: '密码修改成功',
      };
    },
  },
] as MockMethod[];
