import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Common Components
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/routing/ProtectedRoute';
import RoleRoute from './components/routing/RoleRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// AWW Pages
import AWWDashboard from './pages/aww/AWWDashboard';
import BeneficiaryListPage from './pages/aww/BeneficiaryListPage';
import BeneficiaryDetailPage from './pages/aww/BeneficiaryDetailPage';
import StartCounsellingPage from './pages/aww/StartCounsellingPage';
import CounsellingDetailPage from './pages/aww/CounsellingDetailPage';

// FMCH Pages
import FMCHDashboard from './pages/fmch/FMCHDashboard';
import FMCHCounsellingListPage from './pages/fmch/FMCHCounsellingListPage';
import FMCHCounsellingDetailPage from './pages/fmch/FMCHCounsellingDetailPage';

// Role-based dashboard redirector
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'FMCH') {
    return <Navigate to="/fmch/dashboard" replace />;
  }
  return <Navigate to="/aww/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-[#fafaf5] text-[#1a1a2e]">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Shared Protected Redirect / Profile */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardRedirect />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* AWW Protected Routes */}
                <Route
                  path="/aww/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['AWW']}>
                        <AWWDashboard />
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/aww/beneficiaries"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['AWW']}>
                        <BeneficiaryListPage />
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/aww/beneficiaries/:id"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['AWW']}>
                        <BeneficiaryDetailPage />
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/aww/counselling"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['AWW']}>
                        <StartCounsellingPage />
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/aww/counselling/:id"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['AWW']}>
                        <CounsellingDetailPage />
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />

                {/* FMCH Protected Routes */}
                <Route
                  path="/fmch/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['FMCH']}>
                        <FMCHDashboard />
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fmch/counselling"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['FMCH']}>
                        <FMCHCounsellingListPage />
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fmch/counselling/:id"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['FMCH']}>
                        <FMCHCounsellingDetailPage />
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />

                {/* Error Routes */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
