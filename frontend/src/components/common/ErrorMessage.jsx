import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

const ErrorMessage = ({
  title = 'AN ERROR OCCURRED',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`
        border-[3px] border-[#1a1a2e]
        shadow-[3px_3px_0_#1a1a2e]
        bg-[#fafaf5]
        overflow-hidden
        ${className}
      `}
      role="alert"
    >
      <div className="bg-[#e63946] text-white px-4 py-2 flex items-center gap-2 border-b-[3px] border-[#1a1a2e]">
        <AlertTriangle className="w-5 h-5 stroke-[3]" />
        <span className="font-black text-sm uppercase tracking-tight">{title}</span>
      </div>

      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-bold text-sm text-[#1a1a2e]">
          {message || 'Unable to complete the requested action. Please verify the backend connection and try again.'}
        </p>

        {onRetry && (
          <Button
            variant="dark"
            size="sm"
            onClick={onRetry}
            className="shrink-0"
          >
            RETRY
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

