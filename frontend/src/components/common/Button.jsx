import React from 'react';

const VARIANTS = {
  primary: 'bg-[#e63946] text-white',
  secondary: 'bg-[#4ea8de] text-[#1a1a2e]',
  success: 'bg-[#2ecc71] text-[#1a1a2e]',
  warning: 'bg-[#f1c40f] text-[#1a1a2e]',
  white: 'bg-white text-[#1a1a2e]',
  dark: 'bg-[#1a1a2e] text-white',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  xl: 'px-8 py-4 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  icon: Icon,
  ...props
}) => {
  const variantStyles = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyles = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        border-[3px] border-[#1a1a2e]
        rounded-none
        font-black uppercase tracking-tight
        shadow-[3px_3px_0_#1a1a2e]
        cursor-pointer
        transition-all duration-150
        hover:translate-x-0.5 hover:translate-y-0.5
        active:translate-x-1 active:translate-y-1 active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:active:shadow-[3px_3px_0_#1a1a2e]
        ${variantStyles}
        ${sizeStyles}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" strokeWidth={2.5} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;

