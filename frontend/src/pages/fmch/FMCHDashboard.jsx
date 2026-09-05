import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import counsellingService from '../../services/counsellingService';
import { Activity, CheckCircle2, Clock, Users, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import ErrorMessage from '../../components/common/ErrorMessage';
import CounsellingCard from '../../components/counselling/CounsellingCard';
import { useLanguage } from '../../context/LanguageContext';

const FMCHDashboard = () => {
  const { t } = useLanguage();
  const [counsellings, setCounsellings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await counsellingService.getCounsellings();
      setCounsellings(res.data || []);
    } catch (err) {
      console.error('Failed to load FMCH records:', err);
      setError('Unable to fetch counselling records from backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Derived counts from real backend records only
  const totalCount = counsellings.length;
  const completedCount = counsellings.filter((c) => c.status === 'completed').length;
  const inProgressCount = counsellings.filter((c) => c.status === 'in-progress').length;

  // Unique beneficiaries reached
  const uniqueBeneficiaries = new Set(
    counsellings.map((c) => (typeof c.beneficiary === 'object' ? c.beneficiary?._id : c.beneficiary)).filter(Boolean)
  ).size;

  if (loading) {
    return <LoadingState message={t('loading', 'LOADING MONITORING DASHBOARD...')} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Banner */}
      <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#2ecc71] px-2 py-0.5 border-[2px] border-[#1a1a2e] text-[#1a1a2e]">
                {t('supervisory_overview', 'SUPERVISORY OVERVIEW')}
              </span>
              <span className="text-[10px] font-black uppercase bg-[#1a1a2e] text-white px-2 py-0.5">
                {t('fmch_coordinator', 'FMCH COORDINATOR')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1a1a2e] uppercase tracking-tight">
              {t('monitoring_dashboard_title', 'COUNSELLING MONITORING DASHBOARD')}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
              {t('monitoring_dashboard_sub', 'Real-time monitoring of Anganwadi field consultations and decision support usage.')}
            </p>
          </div>

          <Button
            variant="white"
            size="sm"
            onClick={fetchRecords}
            icon={RefreshCw}
            aria-label="Refresh records"
            className="font-black"
          >
            {t('refresh', 'REFRESH')}
          </Button>
        </div>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchRecords}
          className="mb-8"
        />
      )}

      {/* Operational Metrics (Calculated from actual records) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-gray-600">{t('total_sessions', 'TOTAL SESSIONS')}</span>
            <Activity className="w-5 h-5 text-[#1a1a2e]" />
          </div>
          <span className="text-3xl font-black text-[#1a1a2e]">{totalCount}</span>
        </div>

        <div className="border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-[#2ecc71]">{t('completed', 'COMPLETED')}</span>
            <CheckCircle2 className="w-5 h-5 text-[#2ecc71] stroke-[3]" />
          </div>
          <span className="text-3xl font-black text-[#1a1a2e]">{completedCount}</span>
        </div>

        <div className="border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-[#f1c40f]">{t('in_progress', 'IN PROGRESS')}</span>
            <Clock className="w-5 h-5 text-[#f1c40f] stroke-[3]" />
          </div>
          <span className="text-3xl font-black text-[#1a1a2e]">{inProgressCount}</span>
        </div>

        <div className="border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-[#4ea8de]">{t('beneficiaries_reached', 'BENEFICIARIES REACHED')}</span>
            <Users className="w-5 h-5 text-[#4ea8de] stroke-[3]" />
          </div>
          <span className="text-3xl font-black text-[#1a1a2e]">{uniqueBeneficiaries}</span>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b-[3px] border-[#1a1a2e] mb-6">
          <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a2e]">
            {t('recent_activity_title', 'RECENT COUNSELLING ACTIVITY')}
          </h2>

          <Link to="/fmch/counselling">
            <Button variant="white" size="sm" icon={ArrowRight} className="font-black">
              {t('view_all_records_btn', 'VIEW ALL RECORDS')}
            </Button>
          </Link>
        </div>

        {counsellings.length === 0 ? (
          <div className="border-[3px] border-dashed border-[#1a1a2e] bg-white p-12 text-center">
            <p className="font-black text-sm uppercase text-[#1a1a2e]">
              {t('no_data_available', 'NO DATA AVAILABLE')}
            </p>
            <p className="text-xs font-bold text-gray-600 mt-1">
              Field counselling sessions conducted by Anganwadi workers will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {counsellings.slice(0, 6).map((coun) => (
              <CounsellingCard
                key={coun._id}
                counselling={coun}
                basePath="/fmch/counselling"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FMCHDashboard;
