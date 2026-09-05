import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import beneficiaryService from '../../services/beneficiaryService';
import counsellingService from '../../services/counsellingService';
import { Sparkles, ArrowLeft, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import ErrorMessage from '../../components/common/ErrorMessage';
import RecommendationCard from '../../components/counselling/RecommendationCard';

const StartCounsellingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const preselectedBeneficiaryId = searchParams.get('beneficiaryId') || '';

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(true);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState(preselectedBeneficiaryId);
  const [focusArea, setFocusArea] = useState('nutrition');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Result state
  const [createdCounselling, setCreatedCounselling] = useState(null);
  const [mlResult, setMlResult] = useState(null);

  const focusAreas = [
    { value: 'nutrition', label: t('focus_nutrition', 'Nutrition & Diet Counselling'), keywords: 'nutrition diet feeding meal food eating' },
    { value: 'breastfeeding', label: t('focus_breastfeeding', 'Breastfeeding & Lactation Guidance'), keywords: 'breastfeeding lactation breast milk feeding' },
    { value: 'child_wellbeing', label: t('focus_child', 'Child Growth & Infant Wellbeing'), keywords: 'child baby infant growth wellbeing' },
    { value: 'maternal_wellbeing', label: t('focus_maternal', 'Maternal Care & Pregnancy Wellbeing'), keywords: 'mother maternal pregnancy pregnant wellbeing' },
    { value: 'general', label: t('focus_general', 'General Health & Hygiene Guidance'), keywords: 'general healthy practices wellbeing' },
  ];

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        setLoadingBeneficiaries(true);
        const res = await beneficiaryService.getBeneficiaries();
        setBeneficiaries(res.data || []);
        if (preselectedBeneficiaryId) {
          setSelectedBeneficiaryId(preselectedBeneficiaryId);
        } else if (res.data && res.data.length > 0) {
          setSelectedBeneficiaryId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch beneficiaries:', err);
      } finally {
        setLoadingBeneficiaries(false);
      }
    };
    fetchBeneficiaries();
  }, [preselectedBeneficiaryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBeneficiaryId) {
      setSubmitError('Please select a beneficiary to counsel.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const selectedFocus = focusAreas.find((f) => f.value === focusArea);
      const contextualInput = {
        focusArea: selectedFocus ? selectedFocus.label : 'General Counselling',
        observations: notes.trim() || `Counselling consultation regarding ${selectedFocus?.label}`,
        contextSummary: `${selectedFocus?.keywords || ''} ${notes.trim()}`.trim(),
      };

      const payload = {
        beneficiary: selectedBeneficiaryId,
        conductedBy: user?.id,
        inputs: contextualInput,
      };

      const response = await counsellingService.createCounselling(payload);

      setCreatedCounselling(response.data);
      setMlResult(response.mlResult);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Counselling submission error:', err);
      setSubmitError(
        err.response?.data?.message ||
        'Failed to submit counselling session. Please ensure the backend and ML service are running.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNew = () => {
    setCreatedCounselling(null);
    setMlResult(null);
    setNotes('');
    setSubmitError(null);
  };

  const beneficiaryOptions = beneficiaries.map((b) => ({
    value: b._id,
    label: `${b.name} (${b.age} ${t('yrs', 'yrs')}) - ${b.contactNumber || t('no_data_available', 'No phone')}`,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/aww/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#1a1a2e] hover:underline"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          {t('back_to_dashboard', 'BACK TO DASHBOARD')}
        </button>

        <span className="text-xs font-black uppercase bg-[#f1c40f] px-2.5 py-1 border-[2px] border-[#1a1a2e]">
          {t('counselling_flow_badge', 'AWW COUNSELLING FLOW')}
        </span>
      </div>

      {/* When Recommendation is returned */}
      {createdCounselling && (
        <div className="mb-10 space-y-6">
          <div className="border-[3px] border-[#1a1a2e] bg-[#2ecc71] p-4 text-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 stroke-[3]" />
              <span className="font-black text-sm uppercase">
                {t('counselling_completed_banner', 'COUNSELLING COMPLETED & RECOMMENDATION GENERATED')}
              </span>
            </div>
            <span className="text-xs font-black uppercase bg-white px-2 py-0.5 border-[2px] border-[#1a1a2e]">
              LANGUAGE: {(language || user?.preferredLanguage || 'en').toUpperCase()}
            </span>
          </div>

          {/* Prominent Recommendation Card with TTS Button */}
          <RecommendationCard
            recommendation={
              mlResult?.recommendation ||
              createdCounselling.recommendation ||
              'Guidance successfully recorded.'
            }
            language={language || user?.preferredLanguage || 'en'}
          />

          {/* Post-Submission Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleResetForNew}
              icon={RotateCcw}
              className="font-black"
            >
              {t('counsel_another_btn', 'COUNSEL ANOTHER BENEFICIARY')}
            </Button>

            <Link to={`/aww/counselling/${createdCounselling._id}`}>
              <Button
                variant="white"
                size="md"
                icon={ArrowRight}
                className="font-black"
              >
                {t('view_full_session_btn', 'VIEW FULL SESSION RECORD')}
              </Button>
            </Link>

            <Link to="/aww/dashboard">
              <Button
                variant="white"
                size="md"
                className="font-black"
              >
                {t('return_dashboard_btn', 'RETURN TO DASHBOARD')}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Counselling Input Card (Shown when not yet submitted or doing another) */}
      {!createdCounselling && (
        <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white overflow-hidden">
          <div className="bg-[#1a1a2e] text-white px-6 py-4 border-b-[3px] border-[#1a1a2e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f1c40f]" />
              <h1 className="font-black text-lg uppercase tracking-tight">
                {t('start_counselling_header', 'START BENEFICIARY COUNSELLING')}
              </h1>
            </div>
            <span className="text-[10px] font-black uppercase bg-[#e63946] px-2 py-0.5">
              {t('fast_flow_badge', 'FAST FLOW')}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            {submitError && (
              <ErrorMessage
                title="SUBMISSION ERROR"
                message={submitError}
                className="mb-6"
              />
            )}

            {isSubmitting ? (
              <LoadingState
                message={t('generating_recommendation_msg', 'GENERATING RECOMMENDATION VIA ML...')}
                subtext={t('generating_recommendation_sub', 'Empirical decision support is analyzing input context and translating into your preferred language via NLLB.')}
              />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 1. Beneficiary Selection */}
                <div>
                  <Select
                    label={t('select_beneficiary_label', 'Select Beneficiary')}
                    required
                    value={selectedBeneficiaryId}
                    onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                    options={beneficiaryOptions}
                    disabled={loadingBeneficiaries}
                    placeholder={
                      loadingBeneficiaries
                        ? t('loading', 'Loading beneficiaries...')
                        : beneficiaries.length === 0
                        ? t('no_beneficiaries_yet', 'No beneficiaries registered yet')
                        : t('choose_beneficiary_placeholder', 'Choose a beneficiary')
                    }
                  />

                  {beneficiaries.length === 0 && !loadingBeneficiaries && (
                    <p className="text-xs font-bold text-[#e63946] mt-2">
                      Please register a beneficiary before starting counselling.{' '}
                      <Link to="/aww/beneficiaries" className="underline font-black">
                        Go to Beneficiaries
                      </Link>
                    </p>
                  )}
                </div>

                {/* 2. Quick Focus Area Selector */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#1a1a2e] block mb-2">
                    {t('primary_focus_label', 'Primary Counselling Focus')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {focusAreas.map((area) => {
                      const isSelected = focusArea === area.value;
                      return (
                        <button
                          key={area.value}
                          type="button"
                          onClick={() => setFocusArea(area.value)}
                          className={`
                            p-3 text-left border-[3px] border-[#1a1a2e]
                            font-black text-xs uppercase tracking-tight
                            transition-all duration-150 cursor-pointer
                            ${
                              isSelected
                                ? 'bg-[#f1c40f] shadow-[2px_2px_0_#1a1a2e] translate-x-0.5 translate-y-0.5'
                                : 'bg-white shadow-[2px_2px_0_#1a1a2e] hover:bg-[#fafaf5]'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span>{area.label}</span>
                            {isSelected && <span className="text-[#1a1a2e]">●</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Counselling Observations / Notes */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="counselling-notes"
                    className="text-xs font-black uppercase tracking-wider text-[#1a1a2e]"
                  >
                    {t('observations_label', 'Counselling Context & Observations')}
                  </label>
                  <textarea
                    id="counselling-notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('observations_placeholder', 'Enter context, dietary habits, breastfeeding frequency, infant growth notes, or mother concerns...')}
                    className="w-full px-4 py-3 border-[3px] border-[#1a1a2e] rounded-none bg-white font-bold text-[#1a1a2e] text-sm shadow-[2px_2px_0_#1a1a2e] focus:outline-none focus:bg-[#fafaf5] placeholder:text-gray-400"
                  />
                  <span className="text-xs font-bold text-gray-500">
                    {t('decision_support_explainer', "The platform's decision support engine analyzes this context to formulate relevant guidance.")}
                  </span>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t-[3px] border-[#1a1a2e]">
                  <Button
                    type="submit"
                    variant="primary"
                    size="xl"
                    disabled={isSubmitting || beneficiaries.length === 0}
                    icon={Sparkles}
                    className="w-full text-base font-black"
                  >
                    {t('generate_guidance_btn', 'GENERATE COUNSELLING GUIDANCE')}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartCounsellingPage;
