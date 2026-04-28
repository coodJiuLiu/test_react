import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown, Space, Typography, message, Tabs, Spin } from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import type { ItemType } from 'antd/es/menu/interface';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getMenuList, type MenuItem } from '@/api/menu';
import { clearAuth, getUserInfo } from '@/utils/auth';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

type TagItem = {
  key: string;
  label: string;
  path: string;
  closable?: boolean;
};

const STORAGE_KEYS = {
  TAGS: 'app_tags',
  ACTIVE_TAG: 'app_active_tag',
};

const iconMap: Record<MenuItem['icon'], React.ReactNode> = {
  home: <HomeOutlined />,
  user: <UserOutlined />,
  setting: <SettingOutlined />,
};

const fallbackHomeTag: TagItem = { key: '/', label: '首页', path: '/', closable: false };

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = getUserInfo();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getDefaultTags = (): TagItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      return [fallbackHomeTag];
    }

    return [fallbackHomeTag];
  };

  const getDefaultActiveTag = () => localStorage.getItem(STORAGE_KEYS.ACTIVE_TAG) || '/';

  const [tags, setTags] = useState<TagItem[]>(getDefaultTags);
  const [activeTag, setActiveTag] = useState<string>(getDefaultActiveTag);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAG, activeTag);
  }, [activeTag]);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await getMenuList();
        setMenuItems(response.data);
      } catch {
        message.error('菜单加载失败，请重新登录');
        handleLogout();
      } finally {
        setLoadingMenus(false);
      }
    };

    loadMenus();
  }, []);

  useEffect(() => {
    if (loadingMenus || menuItems.length === 0) {
      return;
    }

    const allowedKeys = new Set(menuItems.map((item) => item.key));
    allowedKeys.add('/');

    setTags((prev) => {
      const next = prev.filter((tag) => allowedKeys.has(tag.key));
      return next.length > 0 ? next : [fallbackHomeTag];
    });

    if (!allowedKeys.has(activeTag)) {
      setActiveTag('/');
    }

    const currentPath = location.pathname;
    const menuItem = menuItems.find((item) => item.path === currentPath);

    if (!menuItem) {
      return;
    }

    const newTag: TagItem = {
      key: menuItem.key,
      label: menuItem.label,
      path: menuItem.path,
      closable: menuItem.key !== '/',
    };

    setTags((prev) => {
      const exists = prev.find((tag) => tag.key === newTag.key);
      return exists ? prev : [...prev, newTag];
    });
    setActiveTag(newTag.key);
  }, [activeTag, loadingMenus, menuItems, location.pathname]);

  const selectedMenuKey = useMemo(() => {
    const current = menuItems.find((item) => item.path === location.pathname);
    return current?.key ? [current.key] : [activeTag];
  }, [activeTag, location.pathname, menuItems]);

  const menuNodes: ItemType[] = menuItems.map((item) => ({
    key: item.key,
    icon: iconMap[item.icon],
    label: item.label,
  }));

  const handleMenuClick = ({ key }: { key: string }) => {
    const menuItem = menuItems.find((item) => item.key === key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  const onTabClick = (key: string) => {
    const tag = tags.find((item) => item.key === key);
    if (tag) {
      navigate(tag.path);
    }
  };

  const onTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action !== 'remove') {
      return;
    }

    const currentKey = targetKey as string;
    const nextTags = tags.filter((tag) => tag.key !== currentKey);

    if (nextTags.length === 0) {
      setTags([fallbackHomeTag]);
      setActiveTag('/');
      navigate('/');
      return;
    }

    if (activeTag === currentKey) {
      const nextActive = nextTags[nextTags.length - 1];
      setActiveTag(nextActive.key);
      navigate(nextActive.path);
    }

    setTags(nextTags);
  };

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem(STORAGE_KEYS.TAGS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAG);
    message.success('退出登录成功');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const tabItems = tags.map((tag) => ({
    label: tag.label,
    key: tag.key,
    closable: tag.closable,
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: '#fff',
            lineHeight: '32px',
          }}
        >
          {collapsed ? <SettingOutlined /> : '测试项目系统'}
        </div>
        <Spin spinning={loadingMenus}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedMenuKey}
            items={menuNodes}
            onClick={handleMenuClick}
          />
        </Spin>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div />
          <Space size="middle">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <Text strong>{userInfo?.name ?? '未登录用户'}</Text>
                <DownOutlined style={{ fontSize: '12px' }} />
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <div style={{ background: colorBgContainer, padding: '8px 16px 0', borderBottom: '1px solid #f0f0f0' }}>
          <Tabs
            hideAdd
            type="editable-card"
            activeKey={activeTag}
            items={tabItems}
            onChange={onTabClick}
            onEdit={onTabEdit}
            style={{ marginBottom: 0 }}
            tabBarStyle={{ margin: 0 }}
          />
        </div>

        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
