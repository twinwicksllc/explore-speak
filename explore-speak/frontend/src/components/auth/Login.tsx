import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { signinSchema, type SigninFormData } from '../../utils/validation';
import LanguageSwitcher from '../LanguageSwitcher';
import './Auth.css';

const Login: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  
  const { signin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = async (data: SigninFormData) => {
    setServerError('');
    setIsSubmitting(true);

    try {
      await signin(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="language-switcher-auth">
        <LanguageSwitcher />
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">{t.auth.welcomeBack}</h1>
          <p className="auth-subtitle">{t.auth.signInToContinue}</p>
        </div>

        {serverError && (
          <div className="auth-error" role="alert" aria-live="polite">
            <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t.auth.email}
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="your@email.com"
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" className="form-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t.auth.password}
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? 'form-input-error' : ''}`}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
            {errors.password && (
              <p id="password-error" className="form-error" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="button-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.auth.signingIn}
              </>
            ) : (
              t.auth.signIn
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            {t.auth.dontHaveAccount}{' '}
            <Link to="/signup" className="auth-link">
              {t.auth.signUp}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
