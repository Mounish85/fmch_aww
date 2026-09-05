import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HeartHandshake, Shield, Sparkles, Volume2, Activity } from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();

  if (!loading && isAuthenticated && user) {
    if (user.role === 'AWW') {
      return <Navigate to="/aww/dashboard" replace />;
    }
    if (user.role === 'FMCH') {
      return <Navigate to="/fmch/dashboard" replace />;
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* Hero Cel-shaded Card */}
      <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white overflow-hidden mb-12">
        <div className="bg-[#f1c40f] border-b-[3px] border-[#1a1a2e] px-6 py-3 flex items-center justify-between">
          <span className="font-black text-xs uppercase tracking-wider text-[#1a1a2e] flex items-center gap-1.5">
            <Activity className="w-4 h-4 stroke-[3]" />
            {t('landing_badge', 'FOUNDATION FOR MOTHER & CHILD HEALTH')}
          </span>
          <span className="bg-[#1a1a2e] text-white text-[10px] font-black uppercase px-2 py-0.5">
            {t('live_platform', 'LIVE PLATFORM')}
          </span>
        </div>

        <div className="p-8 sm:p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#e63946] text-white border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] flex items-center justify-center mb-6">
            <HeartHandshake className="w-10 h-10 stroke-[3]" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#1a1a2e] uppercase tracking-tight max-w-3xl mb-4 leading-none">
            {t('landing_hero_title', 'ANGANWADI WORKER COUNSELLING PLATFORM')}
          </h1>

          <p className="text-base sm:text-lg font-bold text-gray-700 max-w-2xl mb-8">
            {t('landing_hero_desc', 'Fast, contextual decision support and maternal counselling guidance for field workers, powered by empirical reasoning and real-time multilingual translation.')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-md">
            <Link to="/login" className="flex-1 min-w-[160px]">
              <Button variant="primary" size="lg" className="w-full font-black">
                {t('login_btn', 'LOG IN')}
              </Button>
            </Link>
            <Link to="/signup" className="flex-1 min-w-[160px]">
              <Button variant="white" size="lg" className="w-full font-black">
                {t('signup_title', 'CREATE ACCOUNT')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] bg-white p-6">
          <div className="w-10 h-10 bg-[#4ea8de] text-[#1a1a2e] border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_#1a1a2e] flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 stroke-[3]" />
          </div>
          <h3 className="font-black text-base uppercase tracking-tight text-[#1a1a2e] mb-2">
            {t('landing_feat_1_title', 'DECISION SUPPORT')}
          </h3>
          <p className="font-bold text-xs text-gray-700 leading-relaxed">
            {t('landing_feat_1_desc', 'Immediate context detection across nutrition, breastfeeding, and maternal health to guide consultations.')}
          </p>
        </div>

        <div className="border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] bg-white p-6">
          <div className="w-10 h-10 bg-[#2ecc71] text-[#1a1a2e] border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_#1a1a2e] flex items-center justify-center mb-4">
            <Volume2 className="w-6 h-6 stroke-[3]" />
          </div>
          <h3 className="font-black text-base uppercase tracking-tight text-[#1a1a2e] mb-2">
            {t('landing_feat_2_title', 'READ ALOUD (TTS)')}
          </h3>
          <p className="font-bold text-xs text-gray-700 leading-relaxed">
            {t('landing_feat_2_desc', 'Real text-to-speech audio playback in English, Telugu, Hindi, Tamil, and Kannada for direct mother engagement.')}
          </p>
        </div>

        <div className="border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] bg-white p-6">
          <div className="w-10 h-10 bg-[#f1c40f] text-[#1a1a2e] border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_#1a1a2e] flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 stroke-[3]" />
          </div>
          <h3 className="font-black text-base uppercase tracking-tight text-[#1a1a2e] mb-2">
            {t('landing_feat_3_title', 'MONITORING & RECORDS')}
          </h3>
          <p className="font-bold text-xs text-gray-700 leading-relaxed">
            {t('landing_feat_3_desc', 'Supervisory review for FMCH coordinators to track counselling sessions and community outreach.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
