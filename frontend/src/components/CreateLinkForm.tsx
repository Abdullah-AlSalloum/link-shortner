// src/components/CreateLinkForm.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, DatePicker, Card, Typography, Alert } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { shortenUrl } from '../store/slices/linkSlice';
import { RootState } from '../store';

const { Title } = Typography;

interface FormValues {
  originalUrl: string;
  customShortCode?: string;
  expiresAt?: Date;
}

const CreateLinkForm: React.FC = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const { loading, error, currentLink } = useSelector((state: RootState) => state.links);

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(shortenUrl(data.originalUrl));
      reset();
    } catch (error) {
      // Error is handled in the slice
    }
  };

  return (
    <div>
      <Title level={3}>Create New Link</Title>
      
      <Card>
        {error && <Alert message={error} type="error" style={{ marginBottom: '20px' }} />}
        
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          <Form.Item 
            label="Original URL" 
            validateStatus={errors.originalUrl ? 'error' : ''}
            help={errors.originalUrl?.message}
          >
            <Input 
              placeholder="https://example.com/very/long/url/that/needs/shortening" 
              size="large"
              prefix={<LinkOutlined />}
              {...register('originalUrl', { 
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
              loading={loading}
              icon={<LinkOutlined />}
            >
              Create Short Link
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
            />
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${currentLink.shortCode}`);
              }}
              style={{ marginLeft: '10px' }}
            >
              Copy
            </Button>
          </div>
          <p>Original URL: {currentLink.originalUrl}</p>
        </Card>
      )}
    </div>
  );
};

export default CreateLinkForm;
