import type { MockMethod } from 'vite-plugin-mock';

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

export default [
  {
    url: '/users',
    method: 'get',
    response: ({ headers }: { headers: Record<string, string> }) => {
      const token = headers.authorization ?? headers.Authorization ?? '';

      if (!token.includes('admin')) {
        return {
          code: 403,
          message: '无权访问用户列表',
        };
      }

      return {
        code: 200,
        message: '获取用户列表成功',
        data: users,
      };
    },
  },
  {
    url: '/users',
    method: 'post',
    response: ({ body, headers }: { body: Omit<UserRecord, 'key'>; headers: Record<string, string> }) => {
      const token = headers.authorization ?? headers.Authorization ?? '';

      if (!token.includes('admin')) {
        return {
          code: 403,
          message: '无权新增用户',
        };
      }

      const newUser: UserRecord = {
        key: Date.now().toString(),
        ...body,
        age: Number(body.age),
      };

      users = [newUser, ...users];

      return {
        code: 200,
        message: '新增用户成功',
        data: newUser,
      };
    },
  },
  {
    url: /\/users\/\w+/,
    method: 'put',
    response: ({
      query,
      body,
      url,
      headers,
    }: {
      query: Record<string, string>;
      body: Omit<UserRecord, 'key'>;
      url: string;
      headers: Record<string, string>;
    }) => {
      const token = headers.authorization ?? headers.Authorization ?? '';

      if (!token.includes('admin')) {
        return {
          code: 403,
          message: '无权编辑用户',
        };
      }

      const key = url.split('/').pop() ?? query.key;
      const index = users.findIndex((item) => item.key === key);

      if (index === -1) {
        return {
          code: 404,
          message: '用户不存在',
        };
      }

      users[index] = {
        ...users[index],
        ...body,
        age: Number(body.age),
      };

      return {
        code: 200,
        message: '更新用户成功',
        data: users[index],
      };
    },
  },
  {
    url: /\/users\/\w+/,
    method: 'delete',
    response: ({ query, url, headers }: { query: Record<string, string>; url: string; headers: Record<string, string> }) => {
      const token = headers.authorization ?? headers.Authorization ?? '';

      if (!token.includes('admin')) {
        return {
          code: 403,
          message: '无权删除用户',
        };
      }

      const key = url.split('/').pop() ?? query.key;
      users = users.filter((item) => item.key !== key);

      return {
        code: 200,
        message: '删除用户成功',
      };
    },
  },
] as MockMethod[];
