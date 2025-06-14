// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, Button, message } from 'antd';
import { 
  LinkOutlined, 
  BarChartOutlined, 
  UserOutlined, 
  LogoutOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { logout } from '../store/slices/authSlice';
import { getUserLinks } from '../store/slices/linkSlice';
import { getUserAnalytics } from '../store/slices/analyticsSlice';
import type { AppDispatch, RootState } from '../store';
import LinksManagement from '../components/LinksManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import CreateLinkForm from '../components/CreateLinkForm';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedKey, setSelectedKey] = useState('links');

  useEffect(() => {
    // Load user links on component mount
    dispatch(getUserLinks());
    dispatch(getUserAnalytics());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    message.success('Logged out successfully');
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LinkOutlined style={{ fontSize: '24px', color: 'white', marginRight: '16px' }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>Link Shortener</Title>
        </div>
        <div>
          <span style={{ color: 'white', marginRight: '16px' }}>
            <UserOutlined /> {user?.email}
          </span>
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            style={{ color: 'white' }}
          >
            Logout
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            onSelect={({ key }) => setSelectedKey(key)}
          >
            <Menu.Item key="links" icon={<LinkOutlined />}>
              <Link to="/dashboard/links">My Links</Link>
            </Menu.Item>
            <Menu.Item key="analytics" icon={<BarChartOutlined />}>
              <Link to="/dashboard/analytics">Analytics</Link>
            </Menu.Item>
            <Menu.Item key="create" icon={<PlusOutlined />}>
              <Link to="/dashboard/create">Create New Link</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: '#fff',
              borderRadius: '4px',
            }}
          >
            <Routes>
              <Route path="/" element={<LinksManagement />} />
              <Route path="/links" element={<LinksManagement />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/create" element={<CreateLinkForm />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
