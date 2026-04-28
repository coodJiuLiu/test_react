import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, Tag, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { createUser, deleteUser, getUserList, updateUser, type UserPayload, type UserRecord } from '@/api/user';

const roleOptions = [
  { value: 'Admin', label: '管理员' },
  { value: 'User', label: '普通用户' },
  { value: 'Guest', label: '访客' },
];

const statusOptions = [
  { value: 'Active', label: '激活' },
  { value: 'Inactive', label: '禁用' },
];

const UserManagement: React.FC = () => {
  const [data, setData] = useState<UserRecord[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [form] = Form.useForm<UserPayload>();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUserList();
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showModal = (user?: UserRecord) => {
    setEditingUser(user || null);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: UserPayload = {
      ...values,
      age: Number(values.age),
    };

    if (editingUser) {
      await updateUser(editingUser.key, payload);
      message.success('用户更新成功');
    } else {
      await createUser(payload);
      message.success('用户添加成功');
    }

    handleCancel();
    loadUsers();
  };

  const handleDelete = async (key: string) => {
    await deleteUser(key);
    message.success('用户删除成功');
    loadUsers();
  };

  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.email.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [data, searchText],
  );

  const columns: ColumnsType<UserRecord> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRecord['role']) => {
        const colorMap = {
          Admin: 'volcano',
          User: 'geekblue',
          Guest: 'green',
        };

        return <Tag color={colorMap[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserRecord['status']) => (
        <Tag color={status === 'Active' ? 'success' : 'default'}>{status === 'Active' ? '激活' : '禁用'}</Tag>
      ),
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除该用户吗？" onConfirm={() => handleDelete(record.key)} okText="确定" cancelText="取消">
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="用户管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            新增用户
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索姓名或邮箱"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
        </Space>

        <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} rowKey="key" loading={loading} />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true, message: '请输入年龄' }]}>
            <Input type="number" min={1} max={150} />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select options={roleOptions} placeholder="请选择角色" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={statusOptions} placeholder="请选择状态" />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
