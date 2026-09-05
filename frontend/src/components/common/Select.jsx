import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  className = '',
  placeholder = 'Select an option',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-black uppercase tracking-wider text-[#1a1a2e] flex items-center gap-1"
        >
          {label}
          {required && <span className="text-[#e63946]">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-10
            border-[3px] border-[#1a1a2e]
            rounded-none
            bg-white font-bold text-[#1a1a2e] text-sm
            shadow-[2px_2px_0_#1a1a2e]
            appearance-none cursor-pointer
            focus:outline-none focus:bg-[#fafaf5] focus:shadow-[3px_3px_0_#1a1a2e]
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-150
            ${error ? 'border-[#e63946] bg-red-50' : ''}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={typeof option === 'object' ? option.value : option}
              value={typeof option === 'object' ? option.value : option}
            >
              {typeof option === 'object' ? option.label : option}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1a1a2e]">
          <ChevronDown className="w-5 h-5 stroke-[3]" />
        </div>
      </div>

      {error && (
        <span className="text-xs font-black text-[#e63946] tracking-tight">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;

