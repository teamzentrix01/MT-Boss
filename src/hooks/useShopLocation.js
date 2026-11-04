'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'MTBOSS_selected_city';
const EVENT_NAME = 'MTBOSS_city_changed';

export function useShopLocation({ autoDetect = true } = {}) {
  const [selectedCity, setSelectedCityState] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('idle'); // 'idle' | 'detecting' | 'detected' | 'denied' | 'unsupported' | 'error'
  const [showCityModal, setShowCityModal] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState(null);
  const autoDetectFiredRef = useRef(false);

  // Sync state and localStorage
  const setSelectedCity = useCallback((city) => {
    if (!city) return;
    const cleanCity = String(city).trim();
    setSelectedCityState(cleanCity);
    try {
      localStorage.setItem(STORAGE_KEY, cleanCity);
      // Dispatch custom event for cross-component sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: cleanCity }));
      }
    } catch {}
  }, []);

  // Detect location via Geolocation API
  const detectLocation = useCallback(async () => {
    if (typeof window === 'undefined') return;

    if (!('geolocation' in navigator)) {
      setDetectionStatus('unsupported');
      setShowCityModal(true);
      return;
    }

    setIsDetecting(true);
    setDetectionStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `/api/location/reverse-geocode?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();

          if (data?.success && data?.city) {
            setDetectedInfo(data);
            if (data.isSupported || data.matchedCity) {
              const finalCity = data.matchedCity || data.city;
              setSelectedCity(finalCity);
              setDetectionStatus('detected');
              setShowCityModal(false);
            } else {
              // City detected but not currently supported
              setDetectionStatus('unsupported_city');
              setShowCityModal(true);
            }
          } else {
            setDetectionStatus('error');
            setShowCityModal(true);
          }
        } catch (err) {
          console.warn('Location reverse geocode error:', err);
          setDetectionStatus('error');
          setShowCityModal(true);
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.warn('Geolocation permission error code:', error.code, error.message);
        if (error.code === 1) {
          // PERMISSION_DENIED
          setDetectionStatus('denied');
        } else {
          setDetectionStatus('error');
        }
        setIsDetecting(false);
        setShowCityModal(true);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 min cached GPS is acceptable
      }
    );
  }, [setSelectedCity]);

  // Initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let savedCity = '';
    try {
      savedCity = localStorage.getItem(STORAGE_KEY) || '';
    } catch {}

    if (savedCity) {
      setSelectedCityState(savedCity);
    } else if (autoDetect && !autoDetectFiredRef.current) {
      autoDetectFiredRef.current = true;
      detectLocation();
    }
  }, [autoDetect, detectLocation]);

  // Sync across tabs and other components
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustomEvent = (e) => {
      if (e?.detail && typeof e.detail === 'string') {
        setSelectedCityState(e.detail);
      }
    };

    const handleStorageEvent = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setSelectedCityState(e.newValue);
      }
    };

    window.addEventListener(EVENT_NAME, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  return {
    selectedCity,
    setSelectedCity,
    isDetecting,
    detectionStatus,
    showCityModal,
    setShowCityModal,
    detectLocation,
    detectedInfo,
  };
}

