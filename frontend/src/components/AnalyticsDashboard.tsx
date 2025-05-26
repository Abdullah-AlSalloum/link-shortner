// src/components/AnalyticsDashboard.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Card, Row, Col, Statistic, Table, Select } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUserAnalytics } from '../store/slices/analyticsSlice';
import { RootState } from '../store';

const { Title } = Typography;
const { Option } = Select;

const AnalyticsDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { analyticsData, loading } = useSelector((state: RootState) => state.analytics);
  const [selectedLink, setSelectedLink] = React.useState<string | null>(null);

  useEffect(() => {
    dispatch(getUserAnalytics());
  }, [dispatch]);

  // Find the selected link data
  const currentLinkData = selectedLink 
    ? analyticsData.find(item => item.linkId === selectedLink) 
    : analyticsData[0];

  // Prepare chart data for clicks by date
  const prepareClicksByDateData = () => {
    if (!currentLinkData) return [];
    
    return Object.entries(currentLinkData.clicksByDate || {}).map(([date, count]) => ({
      date,
      clicks: count,
    }));
  };

  // Prepare chart data for clicks by referrer
  const prepareClicksByReferrerData = () => {
    if (!currentLinkData) return [];
    
    return Object.entries(currentLinkData.clicksByReferrer || {}).map(([referrer, count]) => ({
      referrer,
      clicks: count,
    }));
  };

  // Prepare chart data for clicks by location
  const prepareClicksByLocationData = () => {
    if (!currentLinkData) return [];
    
    return Object.entries(currentLinkData.clicksByLocation || {}).map(([location, count]) => ({
      location,
      clicks: count,
    }));
  };

  return (
    <div>
      <Title level={3}>Analytics Dashboard</Title>
      
      <Card style={{ marginBottom: 20 }}>
        <Select
          style={{ width: '100%', marginBottom: 20 }}
          placeholder="Select a link to view analytics"
          onChange={value => setSelectedLink(value)}
          value={selectedLink || (analyticsData[0]?.linkId || undefined)}
          loading={loading}
        >
          {analyticsData.map(item => (
            <Option key={item.linkId} value={item.linkId}>
              {item.shortCode} - {item.originalUrl}
            </Option>
          ))}
        </Select>

        {currentLinkData && (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic 
                  title="Total Clicks" 
                  value={currentLinkData.totalClicks || 0} 
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Short URL" 
                  value={`${window.location.origin}/${currentLinkData.shortCode}`} 
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Created At" 
                  value={new Date(currentLinkData.createdAt).toLocaleDateString()} 
                />
              </Col>
            </Row>
          </>
        )}
      </Card>

      {currentLinkData && (
        <>
          <Card title="Clicks by Date" style={{ marginBottom: 20 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={prepareClicksByDateData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clicks" fill="#1890ff" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="Clicks by Referrer">
                <Table
                  dataSource={prepareClicksByReferrerData()}
                  columns={[
                    { title: 'Referrer', dataIndex: 'referrer', key: 'referrer' },
                    { title: 'Clicks', dataIndex: 'clicks', key: 'clicks' },
                  ]}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Clicks by Location">
                <Table
                  dataSource={prepareClicksByLocationData()}
                  columns={[
                    { title: 'Location', dataIndex: 'location', key: 'location' },
                    { title: 'Clicks', dataIndex: 'clicks', key: 'clicks' },
                  ]}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
