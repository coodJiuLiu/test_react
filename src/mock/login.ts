import type { MockMethod } from 'vite-plugin-mock';

interface LoginRequestBody {
  username: string;
  password: string;
}

export default [
  {
    url: '/login',
    method: 'post',
    response: ({ body }: { body: LoginRequestBody }) => {
      const { username, password } = body;

      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          data: {
            token: 'mock-token-admin',
            userInfo: {
              id: '1',
              name: '管理员',
              role: 'admin',
              permissions: ['user:view', 'settings:view'],
            },
          },
          message: '登录成功',
        };
      }

      if (username === 'operator' && password === '123456') {
        return {
          code: 200,
          data: {
            token: 'mock-token-operator',
            userInfo: {
              id: '2',
              name: '运营同学',
              role: 'operator',
              permissions: [],
            },
          },
          message: '登录成功',
        };
      }

      return {
        code: 401,
        data: null,
        message: '用户名或密码错误',
      };
    },
  },
] as MockMethod[];
