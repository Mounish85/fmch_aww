import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Calendar, Trash2, Edit3, MessageSquarePlus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../common/Button';

const BeneficiaryCard = ({
  beneficiary,
  onEdit,
  onDelete,
  onCounsel,
  className = '',
}) => {
  const { t } = useLanguage();
  const { _id, name, age, contactNumber, address, createdAt } = beneficiary;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
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
      {/* Top Details */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 border-[2px] border-[#1a1a2e] bg-[#f1c40f] inline-block mb-1">
              {t('beneficiaries', 'BENEFICIARY')}
            </span>
            <h4 className="font-black text-lg text-[#1a1a2e] uppercase tracking-tight line-clamp-1">
              {name}
            </h4>
          </div>
          <span className="border-[2px] border-[#1a1a2e] bg-[#fafaf5] px-2 py-0.5 font-black text-xs text-[#1a1a2e]">
            {age} {t('yrs', 'YRS')}
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-bold text-gray-700">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#1a1a2e] shrink-0" />
            <span>{contactNumber || t('no_data_available', 'NO PHONE RECORDED')}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#1a1a2e] shrink-0" />
            <span className="line-clamp-1">{address || t('no_data_available', 'NO ADDRESS RECORDED')}</span>
          </div>

          {formattedDate && (
            <div className="flex items-center gap-2 text-gray-500 pt-1">
              <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>{t('registered', 'Registered')}: {formattedDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t-[3px] border-[#1a1a2e] bg-[#fafaf5] p-3 flex items-center justify-between gap-2">
        <Link to={`/aww/beneficiaries/${_id}`} className="flex-1">
          <Button variant="white" size="sm" className="w-full text-xs font-black">
            {t('view', 'VIEW')}
          </Button>
        </Link>

        {onCounsel && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onCounsel(beneficiary)}
            icon={MessageSquarePlus}
            className="flex-1 text-xs font-black"
          >
            {t('counsel', 'COUNSEL')}
          </Button>
        )}

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(beneficiary)}
              aria-label="Edit beneficiary"
              className="p-1.5 border-[2px] border-[#1a1a2e] bg-white hover:bg-[#4ea8de] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(beneficiary)}
              aria-label="Delete beneficiary"
              className="p-1.5 border-[2px] border-[#1a1a2e] bg-white hover:bg-[#e63946] hover:text-white transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryCard;
