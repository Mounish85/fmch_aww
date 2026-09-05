import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Square } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

// Language configuration mapping to speech synthesis locale and backend TTS code
const SPEECH_LANG_CONFIG = {
  en: { speechCode: 'en-IN', ttsCode: 'en-IN', label: 'English' },
  te: { speechCode: 'te-IN', ttsCode: 'te', label: 'Telugu' },
  hi: { speechCode: 'hi-IN', ttsCode: 'hi', label: 'Hindi' },
  ta: { speechCode: 'ta-IN', ttsCode: 'ta', label: 'Tamil' },
  kn: { speechCode: 'kn-IN', ttsCode: 'kn', label: 'Kannada' },
};

const TTSButton = ({
  text,
  language = 'en',
  className = '',
  size = 'md',
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  // References for active playback to prevent dual-playback race conditions
  const activeModeRef = useRef('none'); // 'none' | 'speech' | 'audio'
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

  // Initialize and track available speech synthesis voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      stopPlayback();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const stopPlayback = () => {
    activeModeRef.current = 'none';
    setIsPlaying(false);

    // 1. Immediately stop and cancel SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
    }
    if (typeof window !== 'undefined') {
      window._currentUtterance = null;
    }
    utteranceRef.current = null;

    // 2. Immediately stop, pause, and nullify HTML5 Audio
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      } catch (e) {
        console.warn('Error stopping audio element:', e);
      }
    }
  };

  const cleanTextForSpeech = (rawText) => {
    if (!rawText) return '';
    return rawText
      .replace(/[*_~`#[\]]/g, '')
      .replace(/["'""'']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Play exclusively via the server-side /api/tts audio stream
  const playViaAudioStream = (cleanText, langConfig) => {
    stopPlayback();
    activeModeRef.current = 'audio';

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const ttsUrl = `${apiBase}/api/tts?text=${encodeURIComponent(
        cleanText
      )}&lang=${langConfig.ttsCode}`;

      const audio = new Audio(ttsUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        if (activeModeRef.current === 'audio') {
          setIsPlaying(true);
        }
      };

      audio.onended = () => {
        stopPlayback();
      };

      audio.onerror = (e) => {
        console.warn('Audio stream error:', e);
        stopPlayback();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play prevented:', err);
          stopPlayback();
        });
      }
    } catch (err) {
      console.warn('Failed to initiate audio stream:', err);
      stopPlayback();
    }
  };

  // Play exclusively via Web Speech API (with matching native voice)
  const playViaWebSpeech = (cleanText, langConfig, matchingVoice) => {
    stopPlayback();
    activeModeRef.current = 'speech';

    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      playViaAudioStream(cleanText, langConfig);
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = langConfig.speechCode;
      utterance.rate = 0.92;

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      window._currentUtterance = utterance;
      utteranceRef.current = utterance;

      utterance.onstart = () => {
        if (activeModeRef.current === 'speech') {
          setIsPlaying(true);
        }
      };

      utterance.onend = () => {
        stopPlayback();
      };

      utterance.onerror = (e) => {
        // Do not trigger fallback if speech was intentionally cancelled/stopped
        if (e.error === 'canceled' || e.error === 'interrupted') {
          stopPlayback();
          return;
        }
        console.warn('SpeechSynthesis error, falling back to audio stream:', e);
        stopPlayback();
        playViaAudioStream(cleanText, langConfig);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis speak exception:', err);
      stopPlayback();
      playViaAudioStream(cleanText, langConfig);
    }
  };

  const startPlayback = () => {
    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    // 1. Completely halt all previous sounds first
    stopPlayback();

    const langConfig = SPEECH_LANG_CONFIG[language] || SPEECH_LANG_CONFIG.en;

    // 2. Check if a native voice exists in the browser for this language
    const voices =
      availableVoices.length > 0
        ? availableVoices
        : typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis.getVoices()
        : [];

    let matchingVoice = null;
    if (voices && voices.length > 0) {
      matchingVoice = voices.find((v) => {
        const vLang = (v.lang || '').toLowerCase().replace('_', '-');
        return (
          vLang === langConfig.speechCode.toLowerCase() ||
          vLang.startsWith(language.toLowerCase() + '-') ||
          vLang === language.toLowerCase()
        );
      });
    }

    // 3. Mutually exclusive selection:
    // If a genuine matching voice exists in Web Speech API, use Web Speech API.
    // If no native voice exists (typical on Windows for Telugu/Tamil/Kannada),
    // use the server-side /api/tts audio stream directly.
    // NEVER run both simultaneously.
    if (matchingVoice) {
      playViaWebSpeech(cleanText, langConfig, matchingVoice);
    } else {
      playViaAudioStream(cleanText, langConfig);
    }
  };

  const handleToggle = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  return (
    <Button
      variant={isPlaying ? 'primary' : 'warning'}
      size={size}
      onClick={handleToggle}
      disabled={!text || !text.trim()}
      aria-label={isPlaying ? 'Stop recommendation' : 'Listen to recommendation'}
      className={`font-black tracking-tight ${className}`}
    >
      {isPlaying ? (
        <>
          <Square className="w-4 h-4 fill-current stroke-[3]" />
          <span>{t('stop_btn', 'STOP')}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 stroke-[3]" />
          <span>{t('listen_btn', 'LISTEN')}</span>
        </>
      )}
    </Button>
  );
};

export default TTSButton;
