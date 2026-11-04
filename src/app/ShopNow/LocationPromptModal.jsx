'use client';

import { useState } from 'react';
import { MapPin, Navigation, X, Check, Search, AlertCircle, Loader2 } from 'lucide-react';

export default function LocationPromptModal({
  isOpen,
  onClose,
  cities = [],
  selectedCity = '',
  onSelectCity,
  onDetectLocation,
  isDetecting = false,
  detectionStatus = 'idle',
  detectedInfo = null,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen && !isDetecting) return null;

  const filteredCities = (cities || []).filter((city) =>
    String(city || '').toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && selectedCity && !isDetecting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <MapPin size={20} className={isDetecting ? 'animate-bounce' : ''} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isDetecting ? 'Detecting Location...' : 'Select Delivery Location'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                To check in-stock products & delivery
              </p>
            </div>
          </div>
          {selectedCity && !isDetecting && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Detecting loader view */}
          {isDetecting ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Navigation size={28} className="animate-spin" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                Please allow browser location permission
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs">
                We use your location to automatically find nearby warehouses, show in-stock products, and calculate instant delivery.
              </p>
            </div>
          ) : (
            <>
              {/* Status Notice if any */}
              {detectionStatus === 'unsupported_city' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    We detected <strong>{detectedInfo?.city || 'your area'}</strong>, but MTBOSS currently delivers in selected cities. Please choose an available city below:
                  </div>
                </div>
              )}

              {detectionStatus === 'denied' && (
                <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 rounded-xl flex items-start gap-2.5 text-xs text-slate-600 dark:text-zinc-300">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-blue-500" />
                  <div>
                    Location access was denied. You can select your city manually below:
                  </div>
                </div>
              )}

              {/* Auto-detect button */}
              <button
                type="button"
                onClick={onDetectLocation}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all disabled:opacity-60"
              >
                {isDetecting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Navigation size={16} />
                    Auto-Detect My Location (GPS)
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 my-2 text-slate-400 dark:text-zinc-600">
                <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Or Select Delivery City</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
              </div>

              {/* Search box if cities > 4 */}
              {cities.length > 4 && (
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* City options grid */}
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {filteredCities.map((cityName) => {
                  const isSelected =
                    String(cityName).toLowerCase().trim() ===
                    String(selectedCity).toLowerCase().trim();

                  return (
                    <button
                      key={cityName}
                      type="button"
                      onClick={() => onSelectCity(cityName)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-800/60 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span className="truncate">{cityName}</span>
                      {isSelected && <Check size={14} className="text-blue-600 dark:text-blue-400 flex-shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>

              {filteredCities.length === 0 && (
                <p className="text-center text-xs text-slate-400 dark:text-zinc-500 py-3">
                  No cities found matching &quot;{searchTerm}&quot;
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {selectedCity && !isDetecting && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              Current: <strong className="text-slate-800 dark:text-zinc-200">{selectedCity}</strong>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

