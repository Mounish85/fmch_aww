import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white p-8 sm:p-12 text-center max-w-lg w-full">
        <div className="w-16 h-16 bg-[#e63946] text-white border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-10 h-10 stroke-[3]" />
        </div>

        <h1 className="text-4xl font-black uppercase tracking-tight text-[#1a1a2e] mb-2">
          404 — NOT FOUND
        </h1>

        <p className="text-sm font-bold text-gray-700 mb-8">
          The page or record you are trying to access does not exist on this platform.
        </p>

        <Link to="/">
          <Button variant="primary" size="lg" icon={Home}>
            RETURN TO DASHBOARD
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

