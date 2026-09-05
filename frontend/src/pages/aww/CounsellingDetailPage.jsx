import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import counsellingService from '../../services/counsellingService';
import { ArrowLeft, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import LoadingState from '../../components/common/LoadingState';
import ErrorMessage from '../../components/common/ErrorMessage';
import RecommendationCard from '../../components/counselling/RecommendationCard';

const CounsellingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [counselling, setCounselling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCounselling = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await counsellingService.getCounsellingById(id);
      setCounselling(res.data);
    } catch (err) {
      console.error('Error fetching counselling record:', err);
      setError('Counselling session record not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCounselling();
  }, [fetchCounselling]);

  if (loading) {
    return <LoadingState message={t('loading', 'LOADING COUNSELLING RECORD...')} />;
  }

  if (error || !counselling) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchCounselling} />
      </div>
    );
  }

  const { beneficiary, conductedBy, inputs, recommendation, status, createdAt } = counselling;

  const beneficiaryName = typeof beneficiary === 'object' ? beneficiary?.name : t('beneficiaries', 'Beneficiary');
  const beneficiaryAge = typeof beneficiary === 'object' ? beneficiary?.age : null;
  const beneficiaryPhone = typeof beneficiary === 'object' ? beneficiary?.contactNumber : null;
  const beneficiaryAddress = typeof beneficiary === 'object' ? beneficiary?.address : null;

  const workerName = typeof conductedBy === 'object' ? conductedBy?.name : 'Anganwadi Worker';
  const isCompleted = status === 'completed';

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#1a1a2e] mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 stroke-[3]" />
        {t('back', 'BACK')}
      </button>

      {/* Session Title Header */}
      <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white overflow-hidden mb-6">
        <div className="bg-[#1a1a2e] text-white px-6 py-4 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-black uppercase bg-[#e63946] px-2 py-0.5 inline-block mb-1">
              RECORD #{id.slice(-6).toUpperCase()}
            </span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              {t('counselling_session_title', 'COUNSELLING SESSION')}
            </h1>
          </div>

          <span
            className={`
              inline-flex items-center gap-1.5 px-3 py-1 border-[2px] border-white font-black text-xs uppercase
              ${isCompleted ? 'bg-[#2ecc71] text-[#1a1a2e]' : 'bg-[#f1c40f] text-[#1a1a2e]'}
            `}
          >
            {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : <Clock className="w-4 h-4 stroke-[3]" />}
            {isCompleted ? t('status_completed', 'COMPLETED') : t('status_in_progress', 'IN-PROGRESS')}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y-[3px] sm:divide-y-0 sm:divide-x-[3px] divide-[#1a1a2e] border-b-[3px] border-[#1a1a2e] bg-[#fafaf5]">
          <div className="p-6">
            <span className="text-xs font-black uppercase text-gray-500 block mb-1">
              {t('beneficiaries', 'BENEFICIARY')}
            </span>
            <h3 className="font-black text-lg text-[#1a1a2e] uppercase mb-1">
              {beneficiaryName}
            </h3>
            {beneficiaryAge && (
              <p className="text-xs font-bold text-gray-700">{t('age_label', 'Age')}: {beneficiaryAge} {t('years', 'Years')}</p>
            )}
            {beneficiaryPhone && (
              <p className="text-xs font-bold text-gray-700">{t('phone_label', 'Contact')}: {beneficiaryPhone}</p>
            )}
            {beneficiaryAddress && (
              <p className="text-xs font-bold text-gray-700">{t('address_label', 'Address')}: {beneficiaryAddress}</p>
            )}
          </div>

          <div className="p-6">
            <span className="text-xs font-black uppercase text-gray-500 block mb-1">
              {t('session_metadata', 'SESSION METADATA')}
            </span>
            <p className="text-xs font-bold text-gray-700 mb-1">
              <strong>{t('conducted_by_label', 'Conducted by')}:</strong> {workerName}
            </p>
            {formattedDate && (
              <p className="text-xs font-bold text-gray-700">
                <strong>{t('recorded_at_label', 'Recorded at')}:</strong> {formattedDate}
              </p>
            )}
          </div>
        </div>

        {/* Input Details */}
        <div className="p-6">
          <h4 className="font-black text-sm uppercase tracking-tight text-[#1a1a2e] mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t('recorded_inputs_title', 'RECORDED OBSERVATIONS & INPUTS')}
          </h4>
          <div className="border-[2px] border-[#1a1a2e] bg-white p-4 font-bold text-sm text-[#1a1a2e] leading-relaxed">
            {typeof inputs === 'object' && inputs !== null ? (
              <div className="space-y-2">
                {inputs.focusArea && (
                  <p><strong>{t('primary_focus_label', 'Focus Area')}:</strong> {inputs.focusArea}</p>
                )}
                {inputs.observations && (
                  <p><strong>{t('observations_label', 'Observations')}:</strong> {inputs.observations}</p>
                )}
                {!inputs.focusArea && !inputs.observations && (
                  <pre className="whitespace-pre-wrap font-sans text-xs">
                    {JSON.stringify(inputs, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <p>{String(inputs)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Generated Recommendation & TTS */}
      {recommendation ? (
        <RecommendationCard
          recommendation={recommendation}
          language={language || user?.preferredLanguage || 'en'}
        />
      ) : (
        <div className="border-[3px] border-[#1a1a2e] bg-white p-6 text-center">
          <p className="font-black text-sm uppercase text-gray-600">
            {t('no_data_available', 'NO RECOMMENDATION RETURNED FOR THIS SESSION')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CounsellingDetailPage;
