import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const confirmSchema = z.object({
  code: z.string()
    .min(6, 'Confirmation code must be 6 digits')
    .max(6, 'Confirmation code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

type ConfirmFormData = z.infer<typeof confirmSchema>;

const ConfirmEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  
  // Get email from navigation state (passed from signup)
  const email = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
  });

  const onSubmit = async (data: ConfirmFormData) => {
    if (!email) {
      setError('Email not found. Please sign up again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await confirm(email, data.code);
      // Redirect to login after successful confirmation
      navigate('/login', { 
        state: { 
          message: 'Email confirmed! You can now sign in.',
          email 
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Confirmation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email not found. Please sign up again.');
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      // Call the signup endpoint again to resend the code
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://wtu71yyi3m.execute-api.us-east-1.amazonaws.com'}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'dummy', // Won't be used for existing users
          name: 'dummy',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend code');
      }

      alert('Confirmation code resent! Check your email.');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Email Not Found</h1>
          <p>Please sign up again to receive a confirmation code.</p>
          <button
            onClick={() => navigate('/signup')}
            className="auth-button"
          >
            Go to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Confirm Your Email</h1>
          <p className="auth-subtitle">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="code">Confirmation Code</label>
            <input
              {...register('code')}
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="123456"
              maxLength={6}
              aria-invalid={errors.code ? 'true' : 'false'}
              aria-describedby={errors.code ? 'code-error' : undefined}
              autoComplete="one-time-code"
              autoFocus
            />
            {errors.code && (
              <span id="code-error" className="field-error" role="alert">
                {errors.code.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Confirming...' : 'Confirm Email'}
          </button>

          <div className="auth-footer">
            <p>
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="link-button"
              >
                {isResending ? 'Resending...' : 'Resend code'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmEmail;
