// src/components/LinksManagement.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space, Modal, Form, Input, DatePicker, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import moment from 'moment';
import { updateLink, deleteLink, setCurrentLink } from '../store/slices/linkSlice';
import { getLinkAnalyticsSummary } from '../store/slices/analyticsSlice';
import type {RootState , AppDispatch } from '../store'; 

const { Title } = Typography;

interface EditFormValues {
  originalUrl: string;
  customShortCode: string;
  expiresAt?: moment.Moment;
}

const LinksManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { links, loading } = useSelector((state: RootState) => state.links);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [form] = Form.useForm();
  const [copied, setCopied] = useState<string | null>(null);

  const showEditModal = (link: any) => {
    setEditingLink(link);
    form.setFieldsValue({
      originalUrl: link.originalUrl,
      customShortCode: link.shortCode,
      expiresAt: link.expiresAt ? moment(link.expiresAt) : undefined,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingLink(null);
    form.resetFields();
  };

  const handleUpdate = async (values: EditFormValues) => {
    try {
      await dispatch(updateLink({
        id: editingLink.id,
        data: {
          originalUrl: values.originalUrl,
          shortCode: values.customShortCode,
          expiresAt: values.expiresAt ? values.expiresAt.toISOString() : undefined,
        },
      }));
      setIsModalVisible(false);
      setEditingLink(null);
      form.resetFields();
      message.success('Link updated successfully');
    } catch (error) {
      message.error('Failed to update link');
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this link?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await dispatch(deleteLink(id));
          message.success('Link deleted successfully');
        } catch (error) {
          message.error('Failed to delete link');
        }
      },
    });
  };

  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(shortCode);
    message.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const viewAnalytics = (linkId: string) => {
    dispatch(getLinkAnalyticsSummary(linkId));
    // Navigate to analytics view or show modal
  };

  const columns = [
    {
      title: 'Short URL',
      dataIndex: 'shortCode',
      key: 'shortCode',
      render: (shortCode: string) => (
        <a href={`/${shortCode}`} target="_blank" rel="noopener noreferrer">
          {`${window.location.origin}/${shortCode}`}
        </a>
      ),
    },
    {
      title: 'Original URL',
      dataIndex: 'originalUrl',
      key: 'originalUrl',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Expires At',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (date: string) => (date ? moment(date).format('YYYY-MM-DD HH:mm') : 'Never'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space size="middle">
          <Button 
            icon={<CopyOutlined />} 
            onClick={() => copyToClipboard(record.shortCode)}
          >
            {copied === record.shortCode ? 'Copied!' : 'Copy'}
          </Button>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>My Links</Title>
      <Table 
        columns={columns} 
        dataSource={links} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => {
            dispatch(setCurrentLink(record));
          },
        })}
      />

      <Modal
        title="Edit Link"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="originalUrl"
            label="Original URL"
            rules={[
              { required: true, message: 'Please enter the original URL' },
              { type: 'url', message: 'Please enter a valid URL' },
            ]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item
            name="customShortCode"
            label="Custom Short Code"
            rules={[
              { required: true, message: 'Please enter a short code' },
              { min: 3, message: 'Short code must be at least 3 characters' },
            ]}
          >
            <Input placeholder="custom-code" />
          </Form.Item>
          <Form.Item
            name="expiresAt"
            label="Expiration Date (Optional)"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LinksManagement;
