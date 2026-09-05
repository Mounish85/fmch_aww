import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-black uppercase tracking-wider text-[#1a1a2e] flex items-center gap-1"
        >
          {label}
          {required && <span className="text-[#e63946]">*</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-3
          border-[3px] border-[#1a1a2e]
          rounded-none
          bg-white font-bold text-[#1a1a2e] text-sm
          placeholder:text-gray-400
          shadow-[2px_2px_0_#1a1a2e]
          focus:outline-none focus:bg-[#fafaf5] focus:shadow-[3px_3px_0_#1a1a2e]
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-150
          ${error ? 'border-[#e63946] bg-red-50' : ''}
        `}
        {...props}
      />

      {error && (
        <span className="text-xs font-black text-[#e63946] tracking-tight">
          {error}
        </span>
      )}

      {helperText && !error && (
        <span className="text-xs font-bold text-gray-600">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;

