import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import beneficiaryService from '../../services/beneficiaryService';
import { Users, UserPlus, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingState from '../../components/common/LoadingState';
import ErrorMessage from '../../components/common/ErrorMessage';
import BeneficiaryCard from '../../components/beneficiary/BeneficiaryCard';
import BeneficiaryFormModal from '../../components/beneficiary/BeneficiaryFormModal';
import { useLanguage } from '../../context/LanguageContext';

const BeneficiaryListPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBeneficiaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await beneficiaryService.getBeneficiaries();
      setBeneficiaries(res.data || []);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
      setError('Failed to load beneficiaries from backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  const handleOpenAddModal = () => {
    setEditingBeneficiary(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ben) => {
    setEditingBeneficiary(ben);
    setIsModalOpen(true);
  };

  const handleDelete = async (ben) => {
    if (window.confirm(`Are you sure you want to delete "${ben.name}"?`)) {
      try {
        await beneficiaryService.deleteBeneficiary(ben._id);
        fetchBeneficiaries();
      } catch (err) {
        alert('Failed to delete beneficiary: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleCounsel = (ben) => {
    navigate(`/aww/counselling?beneficiaryId=${ben._id}`);
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
      fetchBeneficiaries();
    } catch (err) {
      alert('Error saving beneficiary: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.name?.toLowerCase().includes(term) ||
      b.contactNumber?.toLowerCase().includes(term) ||
      b.address?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return <LoadingState message={t('loading', 'LOADING BENEFICIARIES...')} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#1a1a2e] mb-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            {t('back_to_dashboard', 'BACK TO DASHBOARD')}
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] uppercase tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7" />
            {t('beneficiary_directory_title', 'BENEFICIARY DIRECTORY')}
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAddModal}
          icon={UserPlus}
          className="font-black"
        >
          {t('new_beneficiary_btn', 'NEW BENEFICIARY')}
        </Button>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchBeneficiaries}
          className="mb-6"
        />
      )}

      {/* Search Input */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder={t('search_ben_placeholder', 'SEARCH BY NAME, PHONE, OR ADDRESS...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Directory Grid */}
      {filteredBeneficiaries.length === 0 ? (
        <div className="border-[3px] border-dashed border-[#1a1a2e] bg-white p-12 text-center">
          <p className="font-black text-sm uppercase text-[#1a1a2e] mb-4">
            {searchTerm
              ? t('no_matching_ben', 'NO MATCHING BENEFICIARIES FOUND')
              : t('no_beneficiaries_yet', 'NO BENEFICIARIES RECORDED YET')}
          </p>
          <Button
            variant="warning"
            size="sm"
            onClick={handleOpenAddModal}
            icon={UserPlus}
            className="font-black"
          >
            {t('add_beneficiary', 'ADD BENEFICIARY')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeneficiaries.map((ben) => (
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

export default BeneficiaryListPage;
