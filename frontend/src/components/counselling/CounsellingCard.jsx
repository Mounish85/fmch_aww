import React from 'react';
import { Link } from 'react-router-dom';
import { User, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

const CounsellingCard = ({
  counselling,
  basePath = '/aww/counselling',
  className = '',
}) => {
  const { t } = useLanguage();
  const { _id, beneficiary, conductedBy, recommendation, status, createdAt } = counselling;

  const beneficiaryName =
    typeof beneficiary === 'object' && beneficiary !== null
      ? beneficiary.name
      : t('beneficiaries', 'Beneficiary');

  const workerName =
    typeof conductedBy === 'object' && conductedBy !== null
      ? conductedBy.name
      : 'Worker';

  const isCompleted = status === 'completed';

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div
      className={`
        border-[3px] border-[#1a1a2e]
        shadow-[3px_3px_0_#1a1a2e]
        bg-white flex flex-col justify-between
        ${className}
      `}
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`
              inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 border-[2px] border-[#1a1a2e]
              ${isCompleted ? 'bg-[#2ecc71] text-[#1a1a2e]' : 'bg-[#f1c40f] text-[#1a1a2e]'}
            `}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-3 h-3 stroke-[3]" />
            ) : (
              <Clock className="w-3 h-3 stroke-[3]" />
            )}
            {isCompleted ? t('status_completed', 'COMPLETED') : t('status_in_progress', 'IN-PROGRESS')}
          </span>

          {formattedDate && (
            <span className="text-xs font-bold text-gray-500">
              {formattedDate}
            </span>
          )}
        </div>

        <h4 className="font-black text-lg text-[#1a1a2e] uppercase tracking-tight line-clamp-1 mb-1">
          {beneficiaryName}
        </h4>

        <div className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-[#1a1a2e]" />
          <span>{t('conducted_by_label', 'Conducted by')}: {workerName}</span>
        </div>

        {recommendation ? (
          <div className="border-[2px] border-[#1a1a2e] bg-[#fafaf5] p-3 text-xs font-bold text-[#1a1a2e] line-clamp-2">
            "{recommendation}"
          </div>
        ) : (
          <div className="border-[2px] border-dashed border-gray-400 p-3 text-xs font-bold text-gray-500 italic">
            {t('no_data_available', 'No recommendation recorded')}
          </div>
        )}
      </div>

      <div className="border-t-[3px] border-[#1a1a2e] bg-[#fafaf5] p-3">
        <Link to={`${basePath}/${_id}`} className="block">
          <Button variant="white" size="sm" icon={ArrowRight} className="w-full text-xs font-black">
            {t('view_record', 'VIEW RECORD')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CounsellingCard;
