import React from 'react';

const Card = ({
  children,
  className = '',
  header,
  headerBg = 'bg-[#1a1a2e]',
  headerTextColor = 'text-white',
  footer,
  footerBg = 'bg-[#fafaf5]',
  bg = 'bg-white',
  shadow = 'shadow-[3px_3px_0_#1a1a2e]',
  ...props
}) => {
  return (
    <div
      className={`
        border-[3px] border-[#1a1a2e]
        rounded-none
        ${shadow}
        ${bg}
        flex flex-col
        ${className}
      `}
      {...props}
    >
      {header && (
        <div
          className={`
            border-b-[3px] border-[#1a1a2e]
            px-5 py-3
            font-black uppercase tracking-tight
            ${headerBg}
            ${headerTextColor}
          `}
        >
          {header}
        </div>
      )}

      <div className="p-5 flex-1">{children}</div>

      {footer && (
        <div
          className={`
            border-t-[3px] border-[#1a1a2e]
            px-5 py-3
            ${footerBg}
          `}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

