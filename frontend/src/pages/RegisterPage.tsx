// src/pages/RegisterPage.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';

const { Title } = Typography;

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(registerUser({ email: data.email, password: data.password }));
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the slice
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
        Register
      </Title>

      <Card>
        {error && <Alert message={error} type="error" style={{ marginBottom: '20px' }} />}

        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          <Form.Item 
            label="Email" 
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="Email" 
              size="large"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email'
                }
              })}
            />
          </Form.Item>
          <Form.Item 
            label="Password" 
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Password" 
              size="large"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
          </Form.Item>
          <Form.Item 
            label="Confirm Password" 
            validateStatus={errors.confirmPassword ? 'error' : ''}
            help={errors.confirmPassword?.message}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Confirm Password" 
              size="large"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === watch('password') || 'Passwords do not match'
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
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
