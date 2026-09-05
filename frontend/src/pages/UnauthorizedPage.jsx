import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Home } from 'lucide-react';
import Button from '../components/common/Button';

const UnauthorizedPage = () => {
  const { user } = useAuth();

  const homePath = user?.role === 'FMCH' ? '/fmch/dashboard' : '/aww/dashboard';

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] bg-white p-8 sm:p-12 text-center max-w-lg w-full">
        <div className="w-16 h-16 bg-[#f1c40f] text-[#1a1a2e] border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 stroke-[3]" />
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight text-[#1a1a2e] mb-2">
          403 — ACCESS RESTRICTED
        </h1>

        <p className="text-sm font-bold text-gray-700 mb-8">
          You do not have administrative clearance or the correct role ({user?.role || 'Guest'}) to view this workflow.
        </p>

        <Link to={homePath}>
          <Button variant="primary" size="lg" icon={Home}>
            GO TO MY DASHBOARD
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

