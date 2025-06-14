// src/pages/GuestPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Button, List, Typography, Card, message, Space } from 'antd';
import { LinkOutlined, CopyOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { shortenUrl, getGuestLinks } from '../store/slices/linkSlice';
import type { AppDispatch, RootState } from '../store';

const { Title, Text } = Typography;

interface FormValues {
  url: string;
}

const GuestPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const { guestLinks, loading, currentLink } = useSelector((state: RootState) => state.links);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Load guest links on component mount
    dispatch(getGuestLinks());
  }, [dispatch]);

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(shortenUrl(data.url));
      reset();
      message.success('URL shortened successfully!');
    } catch (error) {
      message.error('Failed to shorten URL');
    }
  };

  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(shortCode);
    message.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
        URL Shortener
      </Title>

      <Card>
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          <Form.Item 
            label="Enter a long URL" 
            validateStatus={errors.url ? 'error' : ''}
            help={errors.url?.message}
          >
            <Input 
              placeholder="https://example.com/very/long/url/that/needs/shortening" 
              size="large"
              {...register('url', { 
                required: 'URL is required',
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: 'Please enter a valid URL'
                }
              })}
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={loading}
              icon={<LinkOutlined />}
            >
              Shorten URL
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {currentLink && (
        <Card style={{ marginTop: '20px', backgroundColor: '#f0f7ff' }}>
          <Title level={4}>Your shortened URL:</Title>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Input 
              value={`${window.location.origin}/${currentLink.shortCode}`}
              readOnly
              style={{ marginRight: '10px' }}
            />
            <Button 
              icon={<CopyOutlined />} 
              onClick={() => copyToClipboard(currentLink.shortCode)}
            >
              {copied === currentLink.shortCode ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <Text type="secondary">Original URL: {currentLink.originalUrl}</Text>
        </Card>
      )}

      {guestLinks.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <Title level={3}>Your Recent Links</Title>
          <List
            itemLayout="horizontal"
            dataSource={guestLinks}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    key="copy" 
                    icon={<CopyOutlined />} 
                    onClick={() => copyToClipboard(item.shortCode)}
                  >
                    {copied === item.shortCode ? 'Copied!' : 'Copy'}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={`${window.location.origin}/${item.shortCode}`}
                  description={item.originalUrl}
                />
              </List.Item>
            )}
          />
        </div>
      )}

      {!isAuthenticated && (
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Title level={4}>Want more features?</Title>
          <Text>Sign up to manage your links, view analytics, and more!</Text>
          <div style={{ marginTop: '20px' }}>
            <Space>
              <Link to="/login">
                <Button type="primary">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </Space>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestPage;
