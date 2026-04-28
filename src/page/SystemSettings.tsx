import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Switch, Select, Divider, message, Typography, Space, Spin } from 'antd';
import { SaveOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';
import {
  changePassword,
  getSettings,
  saveBasicSettings,
  saveNotificationSettings,
  type BasicSettings,
  type NotificationSettings,
} from '@/api/settings';

const { Title, Text } = Typography;

const languageOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
];

const themeOptions = [
  { value: 'light', label: '浅色模式' },
  { value: 'dark', label: '深色模式' },
  { value: 'auto', label: '跟随系统' },
];

const pageSizeOptions = [
  { value: 10, label: '10 条' },
  { value: 20, label: '20 条' },
  { value: 50, label: '50 条' },
];

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [basicForm] = Form.useForm<BasicSettings>();
  const [securityForm] = Form.useForm();
  const [noticeForm] = Form.useForm<NotificationSettings>();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getSettings();
        basicForm.setFieldsValue(response.data.basic);
        noticeForm.setFieldsValue(response.data.notifications);
      } finally {
        setInitializing(false);
      }
    };

    loadSettings();
  }, [basicForm, noticeForm]);

  const handleSaveBasic = async () => {
    try {
      setLoading(true);
      const values = await basicForm.validateFields();
      await saveBasicSettings(values);
      message.success('基本设置保存成功');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const values = await securityForm.validateFields();

    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }

    await changePassword(values);
    message.success('密码修改成功');
    securityForm.resetFields();
  };

  const handleSaveNotifications = async () => {
    const values = await noticeForm.validateFields();
    await saveNotificationSettings(values);
    message.success('通知设置保存成功');
  };

  return (
    <Spin spinning={initializing}>
      <div style={{ maxWidth: 800 }}>
        <Title level={2}>系统设置</Title>
        <Text type="secondary">管理系统偏好、安全配置与通知策略。</Text>

        <Divider />

        <Card
          title={
            <Space>
              <SaveOutlined /> 基本设置
            </Space>
          }
          style={{ marginBottom: 24 }}
          extra={
            <Button type="primary" loading={loading} onClick={handleSaveBasic}>
              保存更改
            </Button>
          }
        >
          <Form form={basicForm} layout="vertical">
            <Form.Item name="siteName" label="系统名称" rules={[{ required: true, message: '请输入系统名称' }]}>
              <Input placeholder="请输入系统名称" />
            </Form.Item>

            <Form.Item name="language" label="系统语言">
              <Select options={languageOptions} />
            </Form.Item>

            <Form.Item name="theme" label="主题模式">
              <Select options={themeOptions} />
            </Form.Item>

            <Form.Item name="itemsPerPage" label="每页显示条数">
              <Select options={pageSizeOptions} />
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <Space>
              <LockOutlined /> 安全设置
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Form form={securityForm} layout="vertical">
            <Form.Item name="oldPassword" label="当前密码" rules={[{ required: true, message: '请输入当前密码' }]}>
              <Input.Password placeholder="请输入当前密码" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度至少 6 位' },
              ]}
            >
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>

            <Form.Item name="confirmPassword" label="确认新密码" rules={[{ required: true, message: '请再次输入新密码' }]}>
              <Input.Password placeholder="请再次输入新密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={handleChangePassword}>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <Space>
              <BellOutlined /> 通知设置
            </Space>
          }
          extra={<Button onClick={handleSaveNotifications}>保存通知设置</Button>}
        >
          <Form form={noticeForm} layout="vertical">
            <Form.Item name="emailNotice" label="邮件通知" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="smsNotice" label="短信通知" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="siteNotice" label="站内信" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Spin>
  );
};

export default Settings;
