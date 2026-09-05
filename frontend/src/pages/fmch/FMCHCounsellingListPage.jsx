import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import counsellingService from '../../services/counsellingService';
import { ClipboardList, ArrowLeft } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingState from '../../components/common/LoadingState';
import ErrorMessage from '../../components/common/ErrorMessage';
import CounsellingCard from '../../components/counselling/CounsellingCard';
import { useLanguage } from '../../context/LanguageContext';

const FMCHCounsellingListPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [counsellings, setCounsellings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: t('all_statuses', 'All Statuses') },
    { value: 'completed', label: t('completed', 'Completed') },
    { value: 'in-progress', label: t('in_progress', 'In Progress') },
  ];

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await counsellingService.getCounsellings();
      setCounsellings(res.data || []);
    } catch (err) {
      console.error('Error fetching counselling list:', err);
      setError('Failed to load counselling records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = counsellings.filter((c) => {
    const benName = typeof c.beneficiary === 'object' ? c.beneficiary?.name : '';
    const workerName = typeof c.conductedBy === 'object' ? c.conductedBy?.name : '';
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (benName && benName.toLowerCase().includes(term)) ||
      (workerName && workerName.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingState message={t('loading', 'LOADING COUNSELLING RECORDS...')} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate('/fmch/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#1a1a2e] mb-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            {t('back_to_dashboard', 'BACK TO DASHBOARD')}
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] uppercase tracking-tight flex items-center gap-2">
            <ClipboardList className="w-7 h-7" />
            {t('monitoring_records_title', 'COUNSELLING MONITORING RECORDS')}
          </h1>
        </div>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchRecords}
          className="mb-6"
        />
      )}

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="sm:col-span-2">
          <Input
            placeholder={t('search_records_placeholder', 'SEARCH BY BENEFICIARY OR ANGANWADI WORKER NAME...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Record Grid */}
      {filteredRecords.length === 0 ? (
        <div className="border-[3px] border-dashed border-[#1a1a2e] bg-white p-12 text-center">
          <p className="font-black text-sm uppercase text-[#1a1a2e]">
            {searchTerm || statusFilter !== 'all'
              ? t('no_matching_ben', 'NO MATCHING COUNSELLING RECORDS FOUND')
              : t('no_data_available', 'NO COUNSELLING RECORDS AVAILABLE')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((coun) => (
            <CounsellingCard
              key={coun._id}
              counselling={coun}
              basePath="/fmch/counselling"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FMCHCounsellingListPage;
