import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, HeartHandshake } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await login(formData.email.trim(), formData.password);

      const userRole = res?.user?.role;
      const redirectPath =
        location.state?.from?.pathname ||
        (userRole === 'FMCH' ? '/fmch/dashboard' : '/aww/dashboard');

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Main Cel-shaded Login Card */}
        <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#e63946] text-white px-6 py-4 border-b-[3px] border-[#1a1a2e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 stroke-[3]" />
              <span className="font-black text-base uppercase tracking-tight">
                {t('login_card_header', 'FMCH AUTHENTICATION')}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase bg-[#1a1a2e] text-white px-2 py-0.5 border-[2px] border-white">
              {t('login_secure', 'SECURE')}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a1a2e] mb-1">
                {t('login_welcome', 'WELCOME BACK')}
              </h2>
              <p className="text-xs font-bold text-gray-600">
                {t('login_welcome_sub', 'Log in to access your counselling portal')}
              </p>
            </div>

            {error && (
              <ErrorMessage
                title="AUTHENTICATION ERROR"
                message={error}
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label={t('email_label', 'Email Address')}
                type="email"
                required
                placeholder="worker@fmch.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />

              <Input
                label={t('password_label', 'Password')}
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                icon={LogIn}
                className="w-full mt-2 font-black"
              >
                {isLoading ? t('logging_in_btn', 'LOGGING IN...') : t('login_btn', 'LOG IN')}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t-[3px] border-[#1a1a2e] text-center">
              <p className="text-xs font-bold text-gray-700">
                {t('need_account', 'Need a worker or coordinator account?')}{' '}
                <Link
                  to="/signup"
                  className="font-black text-[#e63946] uppercase hover:underline ml-1"
                >
                  {t('signup_here', 'SIGN UP HERE')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
