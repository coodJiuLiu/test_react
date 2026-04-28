import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Button, Spin } from 'antd';
import { UserOutlined, ShoppingOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';
import { getHomeOverview, type HomeOverview, type OverviewMetric } from '@/api/home';

const { Title, Paragraph } = Typography;

const metricIcons = [<UserOutlined />, <ShoppingOutlined />, <DollarOutlined />, <RiseOutlined />];

function getValueStyle(metric: OverviewMetric) {
  if (metric.trend === 'up') {
    return { color: '#3f8600' };
  }

  return undefined;
}

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<HomeOverview | null>(null);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const response = await getHomeOverview();
        setOverview(response.data);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <Spin spinning={loading}>
      <div>
        <Title level={2}>{overview?.welcomeTitle ?? '首页'}</Title>
        <Paragraph type="secondary">{overview?.welcomeDescription ?? '正在加载首页数据...'}</Paragraph>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {(overview?.metrics ?? []).map((metric, index) => (
            <Col key={metric.title} xs={24} sm={12} lg={6}>
              <Card variant="borderless">
                <Statistic
                  title={metric.title}
                  value={metric.value}
                  prefix={metricIcons[index]}
                  suffix={metric.suffix}
                  precision={metric.precision}
                  valueStyle={getValueStyle(metric)}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="系统公告">
              {(overview?.announcements ?? []).map((item) => (
                <p key={item.id}>{item.content}</p>
              ))}
              <Button type="primary">查看更多</Button>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Home;
