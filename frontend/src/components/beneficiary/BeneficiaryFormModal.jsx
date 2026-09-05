import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

const BeneficiaryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contactNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        age: initialData.age !== undefined ? String(initialData.age) : '',
        contactNumber: initialData.contactNumber || '',
        address: initialData.address || '',
      });
    } else {
      setFormData({
        name: '',
        age: '',
        contactNumber: '',
        address: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }
    if (formData.age === '' || formData.age === null) {
      errs.age = 'Age is required';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      errs.age = 'Age must be a valid positive number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: formData.name.trim(),
      age: Number(formData.age),
      contactNumber: formData.contactNumber.trim(),
      address: formData.address.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('edit_ben_modal', 'EDIT BENEFICIARY') : t('register_new_ben_modal', 'REGISTER NEW BENEFICIARY')}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={t('full_name_label', 'Full Name')}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t('name_placeholder', 'e.g., Lakshmi Devi')}
          required
          error={errors.name}
        />

        <Input
          label={t('age_label', 'Age (Years)')}
          type="number"
          min="0"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          placeholder={t('age_placeholder', 'e.g., 24')}
          required
          error={errors.age}
        />

        <Input
          label={t('phone_label', 'Contact Number')}
          type="tel"
          value={formData.contactNumber}
          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          placeholder={t('phone_placeholder', 'e.g., 9876543210')}
          error={errors.contactNumber}
        />

        <Input
          label={t('address_label', 'Address / Anganwadi Area')}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder={t('address_placeholder', 'e.g., Sector 4, Ward 12')}
          error={errors.address}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t-[3px] border-[#1a1a2e] mt-2">
          <Button
            variant="white"
            onClick={onClose}
            disabled={isSubmitting}
            className="font-black"
          >
            {t('cancel', 'CANCEL')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="font-black"
          >
            {isSubmitting
              ? t('saving', 'SAVING...')
              : initialData
              ? t('update', 'UPDATE')
              : t('save_beneficiary_btn', 'SAVE BENEFICIARY')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BeneficiaryFormModal;
