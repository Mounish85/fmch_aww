import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import beneficiaryService from '../../services/beneficiaryService';
import counsellingService from '../../services/counsellingService';
import { MessageSquarePlus, UserPlus, Users, ClipboardList, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import ErrorMessage from '../../components/common/ErrorMessage';
import BeneficiaryCard from '../../components/beneficiary/BeneficiaryCard';
import BeneficiaryFormModal from '../../components/beneficiary/BeneficiaryFormModal';
import CounsellingCard from '../../components/counselling/CounsellingCard';

const AWWDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [counsellings, setCounsellings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Beneficiary Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [benRes, counRes] = await Promise.all([
        beneficiaryService.getBeneficiaries(),
        counsellingService.getCounsellings(),
      ]);

      setBeneficiaries(benRes.data || []);
      setCounsellings(counRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to fetch data from backend. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Beneficiary Handlers
  const handleOpenAddModal = () => {
    setEditingBeneficiary(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ben) => {
    setEditingBeneficiary(ben);
    setIsModalOpen(true);
  };

  const handleDelete = async (ben) => {
    if (window.confirm(`Are you sure you want to delete beneficiary "${ben.name}"?`)) {
      try {
        await beneficiaryService.deleteBeneficiary(ben._id);
        fetchData();
      } catch (err) {
        alert('Failed to delete beneficiary: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleBeneficiarySubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingBeneficiary) {
        await beneficiaryService.updateBeneficiary(editingBeneficiary._id, formData);
      } else {
        await beneficiaryService.createBeneficiary(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error saving beneficiary: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCounsel = (ben) => {
    navigate(`/aww/counselling?beneficiaryId=${ben._id}`);
  };

  if (loading) {
    return <LoadingState message={t('loading', 'LOADING DASHBOARD...')} fullScreen={false} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Welcome Banner */}
      <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider bg-[#f1c40f] px-2 py-0.5 border-[2px] border-[#1a1a2e] text-[#1a1a2e] inline-block mb-2">
              {t('field_portal', 'FIELD PORTAL')}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1a1a2e] uppercase tracking-tight">
              {t('welcome_worker', 'WELCOME BACK')}, {user?.name || 'WORKER'}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
              {t('aww_dashboard_desc', 'Conduct consultations, record observations, and access ML decision support.')}
            </p>
          </div>

          {/* Large Action: START COUNSELLING */}
          <div className="shrink-0">
            <Link to="/aww/counselling">
              <Button
                variant="primary"
                size="lg"
                icon={MessageSquarePlus}
                className="text-base px-8 py-4 shadow-[4px_4px_0_#1a1a2e] font-black"
              >
                {t('start_counselling_btn', 'START COUNSELLING')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchData}
          className="mb-8"
        />
      )}

      {/* Beneficiaries Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b-[3px] border-[#1a1a2e]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1a1a2e]" />
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a2e]">
              {t('beneficiaries_section', 'BENEFICIARIES')} ({beneficiaries.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="white"
              size="sm"
              onClick={fetchData}
              icon={RefreshCw}
              aria-label="Refresh beneficiaries"
              className="font-black"
            >
              {t('refresh', 'REFRESH')}
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={handleOpenAddModal}
              icon={UserPlus}
              className="font-black"
            >
              {t('new_beneficiary_btn', 'NEW BENEFICIARY')}
            </Button>
          </div>
        </div>

        {beneficiaries.length === 0 ? (
          <div className="border-[3px] border-dashed border-[#1a1a2e] bg-[#fafaf5] p-8 text-center">
            <p className="font-black text-sm uppercase text-[#1a1a2e] mb-3">
              {t('no_beneficiaries_yet', 'NO BENEFICIARIES RECORDED YET')}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddModal}
              icon={UserPlus}
              className="font-black"
            >
              {t('register_first_beneficiary', 'REGISTER FIRST BENEFICIARY')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {beneficiaries.slice(0, 6).map((ben) => (
              <BeneficiaryCard
                key={ben._id}
                beneficiary={ben}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCounsel={handleCounsel}
              />
            ))}
          </div>
        )}

        {beneficiaries.length > 6 && (
          <div className="text-center mt-6">
            <Link to="/aww/beneficiaries">
              <Button variant="white" size="md" icon={ArrowRight} className="font-black">
                {t('view_all_beneficiaries', 'VIEW ALL BENEFICIARIES')} ({beneficiaries.length})
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Recent Counselling Section */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b-[3px] border-[#1a1a2e]">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#1a1a2e]" />
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a2e]">
              {t('recent_counselling_section', 'RECENT COUNSELLING')} ({counsellings.length})
            </h2>
          </div>

          <Link to="/aww/counselling">
            <Button variant="white" size="sm" icon={ArrowRight} className="font-black">
              {t('start_new_counselling', 'START NEW')}
            </Button>
          </Link>
        </div>

        {counsellings.length === 0 ? (
          <div className="border-[3px] border-dashed border-[#1a1a2e] bg-[#fafaf5] p-8 text-center">
            <p className="font-black text-sm uppercase text-[#1a1a2e] mb-3">
              {t('no_counselling_yet', 'NO COUNSELLING SESSIONS CONDUCTED YET')}
            </p>
            <Link to="/aww/counselling">
              <Button variant="primary" size="sm" icon={MessageSquarePlus} className="font-black">
                {t('start_first_session', 'START FIRST SESSION')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {counsellings.slice(0, 6).map((coun) => (
              <CounsellingCard
                key={coun._id}
                counselling={coun}
                basePath="/aww/counselling"
              />
            ))}
          </div>
        )}
      </div>

      {/* Beneficiary Modal */}
      <BeneficiaryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBeneficiarySubmit}
        initialData={editingBeneficiary}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AWWDashboard;
