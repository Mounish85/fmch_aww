import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, HeartHandshake } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

const SignupPage = () => {
  const { signup } = useAuth();
  const { t, language, supportedLanguages } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'AWW',
    preferredLanguage: language || 'en',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'AWW', label: `AWW — ${t('role_aww_desc', 'Anganwadi Worker')}` },
    { value: 'FMCH', label: `FMCH — ${t('role_fmch_desc', 'FMCH Coordinator')}` },
  ];

  const languageOptions = supportedLanguages.map((lang) => ({
    value: lang.code,
    label: `${lang.name} (${lang.code.toUpperCase()})`,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        preferredLanguage: formData.preferredLanguage,
      });

      const userRole = res?.user?.role || formData.role;
      if (userRole === 'FMCH') {
        navigate('/fmch/dashboard', { replace: true });
      } else {
        navigate('/aww/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg">
        <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white overflow-hidden">
          {/* Header */}
          <div className="bg-[#4ea8de] text-[#1a1a2e] px-6 py-4 border-b-[3px] border-[#1a1a2e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 stroke-[3]" />
              <span className="font-black text-base uppercase tracking-tight">
                {t('signup_card_header', 'PLATFORM REGISTRATION')}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase bg-[#1a1a2e] text-white px-2 py-0.5">
              {t('signup_new_user', 'NEW USER')}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a1a2e] mb-1">
                {t('signup_title', 'CREATE ACCOUNT')}
              </h2>
              <p className="text-xs font-bold text-gray-600">
                {t('signup_sub', 'Join the FMCH community counselling initiative')}
              </p>
            </div>

            {error && (
              <ErrorMessage
                title="REGISTRATION ERROR"
                message={error}
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label={t('full_name_label', 'Full Name')}
                required
                placeholder="e.g., Sunita Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
              />

              <Input
                label={t('email_label', 'Email Address')}
                type="email"
                required
                placeholder="sunita@fmch.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />

              <Input
                label={t('password_label', 'Password')}
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />

              {/* Role Dropdown */}
              <Select
                label={t('assign_role_label', 'Assign Role')}
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                options={roleOptions}
                disabled={isLoading}
              />

              {/* Language Dropdown */}
              <Select
                label={t('preferred_lang_label', 'Preferred Language')}
                required
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                options={languageOptions}
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                icon={UserPlus}
                className="w-full mt-3 font-black"
              >
                {isLoading
                  ? t('creating_account_btn', 'CREATING ACCOUNT...')
                  : t('signup_btn', 'REGISTER & CONTINUE')}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t-[3px] border-[#1a1a2e] text-center">
              <p className="text-xs font-bold text-gray-700">
                {t('already_registered', 'Already registered?')}{' '}
                <Link
                  to="/login"
                  className="font-black text-[#e63946] uppercase hover:underline ml-1"
                >
                  {t('login_instead', 'LOG IN INSTEAD')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
