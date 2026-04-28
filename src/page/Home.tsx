// src/page/Home.tsx
import React from 'react';
import { Card, Row, Col, Statistic, Typography, Button } from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div>
      <Title level={2}>欢迎回来，管理员</Title>
      <Paragraph type="secondary">
        这是您的后台管理首页，您可以在此查看系统概览和快速操作。
      </Paragraph>

      {/* 统计卡片区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless">
            <Statistic
              title="总用户数"
              value={112893}
              prefix={<UserOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless">
            <Statistic
              title="今日订单"
              value={93}
              prefix={<ShoppingOutlined />}
              suffix="单"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless">
            <Statistic
              title="今日营收"
              value={9320}
              prefix={<DollarOutlined />}
              suffix="元"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless">
            <Statistic
              title="增长率"
              value={11.28}
              prefix={<RiseOutlined />}
              suffix="%"
              // 修复：使用 valueStyle 替代 styles
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 内容区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="系统公告">
            <p>系统将于本周六凌晨进行维护，预计耗时2小时。</p>
            <p>新版本功能已上线，请查看用户管理模块的新增筛选功能。</p>
            <Button type="primary">查看更多</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;