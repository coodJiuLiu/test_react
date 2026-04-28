import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getToken } from '@/utils/auth';

type MockResponseBody = {
  code: number;
  message: string;
  data?: unknown;
};

type UserRecord = {
  key: string;
  name: string;
  age: number;
  email: string;
  role: 'Admin' | 'User' | 'Guest';
  status: 'Active' | 'Inactive';
  address: string;
};

let users: UserRecord[] = [
  {
    key: '1',
    name: '张三',
    age: 32,
    email: 'zhangsan@example.com',
    role: 'Admin',
    status: 'Active',
    address: '北京市朝阳区望京街道 100 号',
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    email: 'lisi@example.com',
    role: 'User',
    status: 'Inactive',
    address: '上海市浦东新区世纪大道 200 号',
  },
  {
    key: '3',
    name: '王五',
    age: 36,
    email: 'wangwu@example.com',
    role: 'User',
    status: 'Active',
    address: '广州市天河区体育西路 300 号',
  },
];

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

const adminMenus = [
  { key: '/', label: '首页', path: '/', icon: 'home' },
  { key: '/user', label: '用户管理', path: '/user', icon: 'user', permission: 'user:view' },
  { key: '/system-settings', label: '系统设置', path: '/system-settings', icon: 'setting', permission: 'settings:view' },
];

const operatorMenus = [{ key: '/', label: '首页', path: '/', icon: 'home' }];

function getMethod(config: AxiosRequestConfig) {
  return (config.method || 'get').toLowerCase();
}

function getUrl(config: AxiosRequestConfig) {
  return config.url || '';
}

function readBody<T>(config: AxiosRequestConfig): T {
  const data = config.data;
  if (!data) {
    return {} as T;
  }

  if (typeof data === 'string') {
    return JSON.parse(data) as T;
  }

  return data as T;
}

function makeResponse(config: InternalAxiosRequestConfig, body: MockResponseBody): AxiosResponse<MockResponseBody> {
  return {
    data: body,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
}

function rejectResponse(config: InternalAxiosRequestConfig, status: number, message: string): never {
  const error = {
    config,
    response: {
      status,
      data: {
        code: status,
        message,
      },
    },
    message,
  };

  throw error;
}

function requireAdmin(config: InternalAxiosRequestConfig) {
  const token = getToken() || '';
  if (!token.includes('admin')) {
    rejectResponse(config, 403, '无权访问该接口');
  }
}

function matchUserDetail(url: string) {
  return /^\/users\/[^/]+$/.test(url);
}

export function createMockResponse(config: InternalAxiosRequestConfig): AxiosResponse<MockResponseBody> | null {
  const method = getMethod(config);
  const url = getUrl(config);

  if (url === '/login' && method === 'post') {
    const body = readBody<{ username: string; password: string }>(config);

    if (body.username === 'admin' && body.password === '123456') {
      return makeResponse(config, {
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock-token-admin',
          userInfo: {
            id: '1',
            name: '管理员',
            role: 'admin',
            permissions: ['user:view', 'settings:view'],
          },
        },
      });
    }

    if (body.username === 'operator' && body.password === '123456') {
      return makeResponse(config, {
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock-token-operator',
          userInfo: {
            id: '2',
            name: '运营同学',
            role: 'operator',
            permissions: [],
          },
        },
      });
    }

    rejectResponse(config, 401, '用户名或密码错误');
  }

  if (url === '/menu/list' && method === 'get') {
    const token = getToken() || '';
    return makeResponse(config, {
      code: 200,
      message: '获取菜单成功',
      data: token.includes('admin') ? adminMenus : operatorMenus,
    });
  }

  if (url === '/users' && method === 'get') {
    requireAdmin(config);
    return makeResponse(config, {
      code: 200,
      message: '获取用户列表成功',
      data: users,
    });
  }

  if (url === '/users' && method === 'post') {
    requireAdmin(config);
    const body = readBody<Omit<UserRecord, 'key'>>(config);
    const newUser: UserRecord = {
      key: Date.now().toString(),
      ...body,
      age: Number(body.age),
    };
    users = [newUser, ...users];
    return makeResponse(config, {
      code: 200,
      message: '新增用户成功',
      data: newUser,
    });
  }

  if (matchUserDetail(url) && method === 'put') {
    requireAdmin(config);
    const key = url.split('/').pop() as string;
    const body = readBody<Omit<UserRecord, 'key'>>(config);
    const index = users.findIndex((item) => item.key === key);

    if (index < 0) {
      rejectResponse(config, 404, '用户不存在');
    }

    users[index] = {
      ...users[index],
      ...body,
      age: Number(body.age),
    };

    return makeResponse(config, {
      code: 200,
      message: '更新用户成功',
      data: users[index],
    });
  }

  if (matchUserDetail(url) && method === 'delete') {
    requireAdmin(config);
    const key = url.split('/').pop() as string;
    users = users.filter((item) => item.key !== key);
    return makeResponse(config, {
      code: 200,
      message: '删除用户成功',
    });
  }

  if (url === '/settings' && method === 'get') {
    requireAdmin(config);
    return makeResponse(config, {
      code: 200,
      message: '获取系统设置成功',
      data: settings,
    });
  }

  if (url === '/settings/basic' && method === 'post') {
    requireAdmin(config);
    const body = readBody<typeof settings.basic>(config);
    settings = {
      ...settings,
      basic: {
        ...body,
        itemsPerPage: Number(body.itemsPerPage),
      },
    };

    return makeResponse(config, {
      code: 200,
      message: '基本设置保存成功',
    });
  }

  if (url === '/settings/notifications' && method === 'post') {
    requireAdmin(config);
    const body = readBody<typeof settings.notifications>(config);
    settings = {
      ...settings,
      notifications: body,
    };

    return makeResponse(config, {
      code: 200,
      message: '通知设置保存成功',
    });
  }

  if (url === '/settings/password' && method === 'post') {
    requireAdmin(config);
    const body = readBody<{ oldPassword: string; newPassword: string; confirmPassword: string }>(config);

    if (body.newPassword !== body.confirmPassword) {
      rejectResponse(config, 400, '两次输入的新密码不一致');
    }

    if (body.oldPassword !== '123456') {
      rejectResponse(config, 400, '当前密码错误');
    }

    return makeResponse(config, {
      code: 200,
      message: '密码修改成功',
    });
  }

  return null;
}
