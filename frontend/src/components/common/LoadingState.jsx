import React from 'react';

const LoadingState = ({
  message = 'LOADING DATA...',
  subtext = 'Please wait while the platform connects to the backend services.',
  fullScreen = false,
  className = '',
}) => {
  const content = (
    <div
      className={`
        border-[3px] border-[#1a1a2e]
        shadow-[4px_4px_0_#1a1a2e]
        bg-white p-8 text-center
        max-w-md w-full
        ${className}
      `}
    >
      {/* Cel-shaded progress block */}
      <div className="w-full h-8 border-[3px] border-[#1a1a2e] bg-[#fafaf5] p-1 mb-4 overflow-hidden relative">
        <div className="h-full bg-[#f1c40f] border-[2px] border-[#1a1a2e] animate-pulse w-full" />
      </div>

      <h4 className="text-lg font-black uppercase tracking-tight text-[#1a1a2e] mb-1">
        {message}
      </h4>

      {subtext && (
        <p className="text-xs font-bold text-gray-700">
          {subtext}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#fafaf5] flex items-center justify-center p-6">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex justify-center">{content}</div>;
};

export default LoadingState;

