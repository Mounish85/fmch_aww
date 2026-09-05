import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, LogOut, User, Menu, X, HeartHandshake } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUpdatingLang, setIsUpdatingLang] = useState(false);

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    try {
      setIsUpdatingLang(true);
      await setLanguage(newLang);
    } catch (err) {
      console.error('Error changing language:', err);
    } finally {
      setIsUpdatingLang(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAWW = user?.role === 'AWW';
  const isFMCH = user?.role === 'FMCH';

  const navLinks = isAWW
    ? [
        { label: t('dashboard', 'DASHBOARD'), path: '/aww/dashboard' },
        { label: t('beneficiaries', 'BENEFICIARIES'), path: '/aww/beneficiaries' },
        { label: t('counselling', 'COUNSELLING'), path: '/aww/counselling' },
      ]
    : isFMCH
    ? [
        { label: t('dashboard', 'DASHBOARD'), path: '/fmch/dashboard' },
        { label: t('records', 'RECORDS'), path: '/fmch/counselling' },
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#fafaf5] border-b-[3px] border-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to={isAWW ? '/aww/dashboard' : isFMCH ? '/fmch/dashboard' : '/'}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="bg-[#e63946] text-white p-2 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_#1a1a2e] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
              <HeartHandshake className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-[#1a1a2e]">FMCH</span>
                <span className="border-[2px] border-[#1a1a2e] bg-[#f1c40f] text-[#1a1a2e] text-[10px] px-1.5 py-0.5 font-black uppercase">
                  {user?.role || t('live_platform', 'PLATFORM')}
                </span>
              </div>
              <p className="text-[11px] font-black tracking-wide text-gray-700 uppercase">
                {t('app_subtitle', 'Counselling & Decision Support')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      px-4 py-2 border-[3px] border-[#1a1a2e]
                      font-black text-xs uppercase tracking-tight
                      transition-all duration-150
                      ${
                        isActive
                          ? 'bg-[#1a1a2e] text-white shadow-[2px_2px_0_#e63946]'
                          : 'bg-white text-[#1a1a2e] shadow-[2px_2px_0_#1a1a2e] hover:bg-[#fafaf5]'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Controls & Language Dropdown */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Global Language Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border-[3px] border-[#1a1a2e] px-2 py-1 shadow-[2px_2px_0_#1a1a2e]">
              <Globe className="w-4 h-4 text-[#1a1a2e] shrink-0" />
              <label htmlFor="nav-lang-select" className="sr-only">
                Select Language
              </label>
              <select
                id="nav-lang-select"
                value={language || 'en'}
                onChange={handleLanguageChange}
                disabled={isUpdatingLang}
                className="bg-transparent font-black text-xs uppercase text-[#1a1a2e] focus:outline-none cursor-pointer"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <>
                {/* User Info Badge */}
                <Link
                  to="/profile"
                  aria-label="View user profile"
                  className="flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] px-3 py-1.5 shadow-[2px_2px_0_#1a1a2e] hover:bg-[#fafaf5] transition-all"
                >
                  <User className="w-4 h-4 text-[#1a1a2e]" />
                  <div className="text-left">
                    <div className="text-xs font-black uppercase text-[#1a1a2e] leading-tight">
                      {user.name}
                    </div>
                  </div>
                </Link>

                {/* Logout Button */}
                <Button
                  variant="white"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                  className="text-xs font-black"
                >
                  {t('logout', 'LOGOUT')}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="white" size="sm" className="font-black">{t('login', 'LOGIN')}</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="font-black">{t('signup', 'SIGN UP')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex items-center gap-1 bg-white border-[2px] border-[#1a1a2e] px-2 py-1">
              <select
                value={language || 'en'}
                onChange={handleLanguageChange}
                disabled={isUpdatingLang}
                className="bg-transparent font-black text-xs uppercase text-[#1a1a2e] focus:outline-none"
                aria-label="Change language"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.code.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 border-[3px] border-[#1a1a2e] bg-white text-[#1a1a2e] shadow-[2px_2px_0_#1a1a2e] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-[3px] border-[#1a1a2e] bg-white p-4 flex flex-col gap-3 shadow-[3px_3px_0_#1a1a2e]">
          {user ? (
            <>
              <div className="p-3 border-[2px] border-[#1a1a2e] bg-[#fafaf5] flex items-center justify-between">
                <div>
                  <div className="font-black text-sm uppercase text-[#1a1a2e]">{user.name}</div>
                  <div className="text-xs font-bold text-gray-600">{user.email} • {user.role}</div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-black uppercase text-[#e63946] underline"
                >
                  {t('profile', 'PROFILE')}
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 border-[2px] border-[#1a1a2e] font-black text-sm uppercase bg-white hover:bg-[#fafaf5]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Button
                variant="white"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                icon={LogOut}
                className="w-full mt-2 font-black"
              >
                {t('logout', 'LOGOUT')}
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="white" className="w-full font-black">{t('login', 'LOGIN')}</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full font-black">{t('signup', 'SIGN UP')}</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
