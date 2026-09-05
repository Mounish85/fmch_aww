import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import userService from '../services/userService';
import { User, Globe, CheckCircle2 } from 'lucide-react';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [isUpdatingLang, setIsUpdatingLang] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const languageOptions = supportedLanguages.map((lang) => ({
    value: lang.code,
    label: `${lang.name} (${lang.code.toUpperCase()})`,
  }));

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setIsUpdatingLang(true);
      await setLanguage(newLang);
      const matched = supportedLanguages.find((l) => l.code === newLang);
      setSuccessMsg(`Language preference updated to ${matched?.name || newLang}!`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update language.');
    } finally {
      setIsUpdatingLang(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      setErrorMsg('');
      setSuccessMsg('');
      await userService.updateUser(user.id, { name: name.trim() });
      await refreshUser();
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white overflow-hidden mb-6">
        <div className="bg-[#f1c40f] border-b-[3px] border-[#1a1a2e] px-6 py-4 flex items-center justify-between">
          <h2 className="font-black text-xl uppercase tracking-tight text-[#1a1a2e]">
            {t('profile_title', 'USER PROFILE & SETTINGS')}
          </h2>
          <span className="border-[2px] border-[#1a1a2e] bg-white font-black text-xs px-2.5 py-0.5 text-[#1a1a2e] uppercase">
            {user.role} {t('records', 'ACCOUNT')}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          {successMsg && (
            <div className="border-[3px] border-[#1a1a2e] bg-[#2ecc71]/20 p-4 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2ecc71] stroke-[3]" />
              <span className="font-black text-xs uppercase text-[#1a1a2e]">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <ErrorMessage
              title="UPDATE ERROR"
              message={errorMsg}
              className="mb-6"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Details Form */}
            <div className="border-[3px] border-[#1a1a2e] bg-[#fafaf5] p-6 shadow-[2px_2px_0_#1a1a2e]">
              <h3 className="font-black text-sm uppercase tracking-tight text-[#1a1a2e] mb-4 pb-2 border-b-[2px] border-[#1a1a2e] flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('account_info', 'ACCOUNT INFORMATION')}
              </h3>

              <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                <Input
                  label={t('full_name_label', 'Full Name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label={t('email_label', 'Email Address')}
                  value={user.email}
                  disabled
                  helperText="Email is permanently tied to this account."
                />

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1a1a2e]">
                    {t('assigned_role', 'Assigned Role')}
                  </span>
                  <div className="px-4 py-2.5 border-[3px] border-[#1a1a2e] bg-white font-bold text-sm text-[#1a1a2e] shadow-[2px_2px_0_#1a1a2e]">
                    {user.role === 'AWW' ? t('role_aww_desc', 'Anganwadi Worker (AWW)') : t('role_fmch_desc', 'FMCH Coordinator')}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isUpdatingProfile}
                  className="mt-2 font-black"
                >
                  {isUpdatingProfile ? t('saving', 'SAVING...') : t('save_details', 'SAVE DETAILS')}
                </Button>
              </form>
            </div>

            {/* Language Preference Section */}
            <div className="border-[3px] border-[#1a1a2e] bg-[#fafaf5] p-6 shadow-[2px_2px_0_#1a1a2e]">
              <h3 className="font-black text-sm uppercase tracking-tight text-[#1a1a2e] mb-4 pb-2 border-b-[2px] border-[#1a1a2e] flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('lang_preference_title', 'LANGUAGE PREFERENCE')}
              </h3>

              <p className="text-xs font-bold text-gray-700 mb-4 leading-relaxed">
                {t('lang_preference_desc', 'Choose the language in which you wish to receive translated decision support recommendations and audio speech playback during counselling sessions.')}
              </p>

              <div className="flex flex-col gap-4">
                <Select
                  label={t('select_platform_lang', 'Select Platform Language')}
                  value={language}
                  onChange={handleLanguageChange}
                  options={languageOptions}
                  disabled={isUpdatingLang}
                />

                <div className="border-[2px] border-[#1a1a2e] bg-white p-4">
                  <span className="font-black text-xs uppercase text-gray-500 block mb-1">
                    {t('current_speech_code', 'CURRENT SPEECH CODE')}
                  </span>
                  <span className="font-black text-base text-[#1a1a2e]">
                    {supportedLanguages.find((l) => l.code === language)?.speechCode || 'en-IN'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
