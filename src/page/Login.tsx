import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '@/api/login';
import { setToken, setUserInfo } from '@/utils/auth';

const { Title, Paragraph } = Typography;

interface LoginResult {
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

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res: LoginResult = await login(values);

      if (res.code === 200 && res.data?.token && res.data.userInfo) {
        setToken(res.data.token);
        setUserInfo(res.data.userInfo);
        message.success(res.message || '登录成功');
        navigate('/');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || '网络请求失败，请稍后重试';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 420, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>系统登录</Title>
          <Paragraph type="secondary">使用 mock 账号体验不同菜单和路由权限。</Paragraph>
        </div>

        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="admin / 123456：可访问用户管理和系统设置"
          description="operator / 123456：仅可访问首页"
        />

        <Form name="login" onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
