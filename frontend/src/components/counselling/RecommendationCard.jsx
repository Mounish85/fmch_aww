import React, { useState, useEffect } from 'react';
import { Sparkles, Info, Languages, Globe, CheckCircle2 } from 'lucide-react';
import TTSButton from './TTSButton';
import Select from '../common/Select';
import Button from '../common/Button';
import counsellingService from '../../services/counsellingService';
import { useLanguage } from '../../context/LanguageContext';

const RecommendationCard = ({
  recommendation,
  language = 'en',
  className = '',
  onLanguageChange,
}) => {
  const { t, language: globalLang, supportedLanguages } = useLanguage();

  const languageOptions = supportedLanguages.map((lang) => ({
    value: lang.code,
    label: `${lang.name} (${lang.code.toUpperCase()})`,
  }));

  // Normalize initial recommendation into title & message
  const parseRec = (rec) => {
    if (typeof rec === 'object' && rec !== null) {
      return {
        title: rec.title || t('counselling_guidance_title', 'COUNSELLING GUIDANCE'),
        message: rec.message || '',
      };
    }
    if (typeof rec === 'string') {
      return {
        title: language === 'en' ? t('counselling_guidance_title', 'COUNSELLING GUIDANCE') : '',
        message: rec,
      };
    }
    return { title: t('counselling_guidance_title', 'COUNSELLING GUIDANCE'), message: '' };
  };

  const [currentRec, setCurrentRec] = useState(parseRec(recommendation));
  const [currentLang, setCurrentLang] = useState(language);
  const [targetLang, setTargetLang] = useState(globalLang || language);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationSuccess, setTranslationSuccess] = useState('');
  const [translationError, setTranslationError] = useState('');

  // Update internal state when parent props change
  useEffect(() => {
    setCurrentRec(parseRec(recommendation));
    setCurrentLang(language);
    setTargetLang(globalLang || language);
  }, [recommendation, language, globalLang]);

  const handleTranslate = async () => {
    if (targetLang === currentLang) {
      setTranslationSuccess(`Already in ${supportedLanguages.find(l => l.code === currentLang)?.name || currentLang.toUpperCase()}`);
      setTimeout(() => setTranslationSuccess(''), 3000);
      return;
    }

    try {
      setIsTranslating(true);
      setTranslationError('');
      setTranslationSuccess('');

      const res = await counsellingService.translateRecommendation(
        currentRec,
        targetLang,
        currentLang
      );

      if (res && res.translated) {
        setCurrentRec({
          title: res.translated.title || '',
          message: res.translated.message || '',
        });
        setCurrentLang(targetLang);
        setTranslationSuccess(
          `Translated to ${supportedLanguages.find(l => l.code === targetLang)?.name}!`
        );

        if (onLanguageChange) {
          onLanguageChange(targetLang);
        }
      } else if (res && res.translatedText) {
        setCurrentRec((prev) => ({
          ...prev,
          message: res.translatedText,
        }));
        setCurrentLang(targetLang);
        setTranslationSuccess(
          `Translated to ${supportedLanguages.find(l => l.code === targetLang)?.name}!`
        );
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslationError('Translation service unavailable. Please check the backend connection.');
    } finally {
      setIsTranslating(false);
      setTimeout(() => setTranslationSuccess(''), 4000);
    }
  };

  if (!currentRec.message) {
    return (
      <div className="border-[3px] border-[#1a1a2e] bg-[#fafaf5] p-6 text-center shadow-[3px_3px_0_#1a1a2e]">
        <p className="font-bold text-sm text-gray-700 uppercase">
          {t('no_data_available', 'NO RECOMMENDATION AVAILABLE YET')}
        </p>
      </div>
    );
  }

  // Construct pure speech text without unwanted English prefixes in other languages
  const speechText = currentRec.title && currentLang === 'en'
    ? `${currentRec.title}. ${currentRec.message}`
    : currentRec.title && currentLang !== 'en'
    ? `${currentRec.title}. ${currentRec.message}`
    : currentRec.message;

  const currentLangObj = supportedLanguages.find((l) => l.code === currentLang);

  return (
    <div
      className={`
        border-[3px] border-[#1a1a2e]
        shadow-[4px_4px_0_#1a1a2e]
        bg-white overflow-hidden
        ${className}
      `}
    >
      {/* Top Banner */}
      <div className="bg-[#2ecc71] border-b-[3px] border-[#1a1a2e] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 stroke-[3] text-[#1a1a2e]" />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-black text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 border-[2px] border-[#1a1a2e] text-[#1a1a2e]">
                {t('decision_support_badge', 'DECISION SUPPORT')}
              </span>
              <span className="font-black text-[10px] uppercase bg-[#1a1a2e] text-white px-2 py-0.5 border-[2px] border-white">
                {currentLangObj?.name.toUpperCase() || currentLang.toUpperCase()}
              </span>
            </div>
            {currentRec.title && (
              <h3 className="font-black text-xl text-[#1a1a2e] uppercase tracking-tight">
                {currentRec.title}
              </h3>
            )}
          </div>
        </div>

        {/* Working Audio Speaker Button */}
        <div className="shrink-0 flex items-center gap-2">
          <TTSButton
            text={speechText}
            language={currentLang}
            size="md"
          />
        </div>
      </div>

      {/* Main Guidance Text */}
      <div className="p-6 bg-white">
        <div className="border-[3px] border-[#1a1a2e] p-5 bg-[#fafaf5] shadow-[2px_2px_0_#1a1a2e] mb-4">
          <p className="font-black text-lg md:text-xl text-[#1a1a2e] leading-relaxed">
            "{currentRec.message}"
          </p>
        </div>

        {/* Translation Control Section (Below the Recommendation) */}
        <div className="border-[3px] border-[#1a1a2e] bg-white p-4 shadow-[2px_2px_0_#1a1a2e] mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Languages className="w-4 h-4 text-[#1a1a2e]" />
            <h4 className="font-black text-xs uppercase tracking-wider text-[#1a1a2e]">
              {t('translate_section_header', 'TRANSLATE RECOMMENDATION TO ANOTHER LANGUAGE')}
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <Select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                options={languageOptions}
                disabled={isTranslating}
              />
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={handleTranslate}
              disabled={isTranslating}
              icon={Globe}
              className="shrink-0 text-xs sm:text-sm font-black"
            >
              {isTranslating ? t('translating_btn', 'TRANSLATING...') : t('translate_rec_btn', 'TRANSLATE RECOMMENDATION')}
            </Button>
          </div>

          {translationSuccess && (
            <div className="mt-3 p-2 bg-[#2ecc71]/20 border-[2px] border-[#1a1a2e] text-xs font-black text-[#1a1a2e] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2ecc71] stroke-[3]" />
              <span>{translationSuccess} Click [ {t('listen_btn', 'LISTEN')} ] to hear it read aloud in this language!</span>
            </div>
          )}

          {translationError && (
            <div className="mt-3 p-2 bg-red-100 border-[2px] border-[#e63946] text-xs font-black text-[#e63946]">
              {translationError}
            </div>
          )}
        </div>

        {/* Ethical Non-Diagnosis Disclaimer */}
        <div className="flex items-start gap-2 text-xs font-bold text-gray-700 bg-yellow-50 border-[2px] border-[#1a1a2e] p-3">
          <Info className="w-4 h-4 text-[#1a1a2e] shrink-0 mt-0.5" />
          <span>
            {t('guidance_disclaimer', 'COUNSELLING GUIDANCE ONLY: This contextual decision support message assists the Anganwadi Worker during community visits. It is not a clinical medical diagnosis or prescription.')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
