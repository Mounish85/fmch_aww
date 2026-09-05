import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a2e]/70"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`
          w-full ${maxWidth}
          border-[3px] border-[#1a1a2e]
          rounded-none
          bg-white
          shadow-[4px_4px_0_#1a1a2e]
          flex flex-col
          overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-[3px] border-[#1a1a2e] bg-[#f1c40f]">
          <h3 id="modal-title" className="font-black text-lg text-[#1a1a2e] uppercase tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 border-[2px] border-[#1a1a2e] bg-white text-[#1a1a2e] hover:bg-[#e63946] hover:text-white transition-colors duration-150 cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

