import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import beneficiaryService from '../../services/beneficiaryService';
import counsellingService from '../../services/counsellingService';
import { ArrowLeft, MessageSquarePlus, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import ErrorMessage from '../../components/common/ErrorMessage';
import CounsellingCard from '../../components/counselling/CounsellingCard';
import { useLanguage } from '../../context/LanguageContext';

const BeneficiaryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [beneficiary, setBeneficiary] = useState(null);
  const [counsellings, setCounsellings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [benRes, counRes] = await Promise.all([
        beneficiaryService.getBeneficiaryById(id),
        counsellingService.getCounsellings(),
      ]);

      setBeneficiary(benRes.data);

      // Filter counselling sessions for this beneficiary
      const benSessions = (counRes.data || []).filter((c) => {
        const cBenId = typeof c.beneficiary === 'object' ? c.beneficiary?._id : c.beneficiary;
        return cBenId === id;
      });

      setCounsellings(benSessions);
    } catch (err) {
      console.error('Error fetching beneficiary detail:', err);
      setError('Beneficiary record not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingState message={t('loading', 'LOADING BENEFICIARY PROFILE...')} />;
  }

  if (error || !beneficiary) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#1a1a2e] mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 stroke-[3]" />
        {t('back', 'BACK')}
      </button>

      {/* Beneficiary Header Card */}
      <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white overflow-hidden mb-8">
        <div className="bg-[#4ea8de] text-[#1a1a2e] px-6 py-4 border-b-[3px] border-[#1a1a2e] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white px-2 py-0.5 border-[2px] border-[#1a1a2e] inline-block mb-1">
              {t('beneficiary_profile_header', 'BENEFICIARY PROFILE')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              {beneficiary.name}
            </h1>
          </div>

          <Link to={`/aww/counselling?beneficiaryId=${beneficiary._id}`}>
            <Button
              variant="primary"
              size="md"
              icon={MessageSquarePlus}
              className="text-xs font-black"
            >
              {t('start_counselling_btn', 'START COUNSELLING')}
            </Button>
          </Link>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#fafaf5]">
          <div className="border-[2px] border-[#1a1a2e] bg-white p-4">
            <span className="text-xs font-black uppercase text-gray-500 block mb-1">
              {t('age_label', 'AGE')}
            </span>
            <span className="font-black text-xl text-[#1a1a2e]">
              {beneficiary.age} {t('years', 'YEARS')}
            </span>
          </div>

          <div className="border-[2px] border-[#1a1a2e] bg-white p-4">
            <span className="text-xs font-black uppercase text-gray-500 block mb-1">
              {t('phone_label', 'CONTACT PHONE')}
            </span>
            <span className="font-black text-base text-[#1a1a2e]">
              {beneficiary.contactNumber || t('no_data_available', 'NOT RECORDED')}
            </span>
          </div>

          <div className="border-[2px] border-[#1a1a2e] bg-white p-4">
            <span className="text-xs font-black uppercase text-gray-500 block mb-1">
              {t('address_label', 'ADDRESS / LOCATION')}
            </span>
            <span className="font-black text-base text-[#1a1a2e] line-clamp-2">
              {beneficiary.address || t('no_data_available', 'NOT RECORDED')}
            </span>
          </div>
        </div>
      </div>

      {/* Past Counselling Sessions for this Beneficiary */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b-[3px] border-[#1a1a2e] mb-6">
          <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a2e] flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t('counselling_history_title', 'COUNSELLING HISTORY')} ({counsellings.length})
          </h2>
        </div>

        {counsellings.length === 0 ? (
          <div className="border-[3px] border-dashed border-[#1a1a2e] bg-white p-8 text-center">
            <p className="font-black text-sm uppercase text-[#1a1a2e] mb-3">
              {t('no_counselling_yet', 'NO COUNSELLING SESSIONS RECORDED FOR THIS BENEFICIARY YET')}
            </p>
            <Link to={`/aww/counselling?beneficiaryId=${beneficiary._id}`}>
              <Button variant="primary" size="sm" icon={MessageSquarePlus} className="font-black">
                {t('conduct_first_session', 'CONDUCT FIRST SESSION')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {counsellings.map((c) => (
              <CounsellingCard
                key={c._id}
                counselling={c}
                basePath="/aww/counselling"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryDetailPage;
