'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { checkSlugAvailability, getSlugSuggestions, updateSiteSlug } from '@/app/actions/websiteActions';

// Debounce helper
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SlugEditorModal({ isOpen, onClose, currentSlug, websiteId, businessName, onUpdate }) {
  const [slug, setSlug] = useState(currentSlug || '');
  const [status, setStatus] = useState('idle'); // idle, checking, available, taken, error
  const [suggestions, setSuggestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const debouncedSlug = useDebounce(slug, 500);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSlug(currentSlug || '');
      setStatus('idle');
      setSuggestions([]);
      setErrorMessage('');
    }
  }, [isOpen, currentSlug]);

  // Check Availability Effect
  useEffect(() => {
    if (!debouncedSlug || debouncedSlug === currentSlug) {
      setStatus('idle');
      setSuggestions([]);
      return;
    }

    if (debouncedSlug.length < 3) {
      setStatus('error');
      setErrorMessage('Slug must be at least 3 characters.');
      return;
    }

    async function check() {
      setStatus('checking');
      setErrorMessage('');
      try {
        const isAvailable = await checkSlugAvailability(debouncedSlug);
        if (isAvailable) {
          setStatus('available');
          setSuggestions([]);
        } else {
          setStatus('taken');
          // Fetch suggestions if taken
          // Use the input as base, or business name if input is just numbers/nonsense?
          // Let's use the input first.
          const newSuggestions = await getSlugSuggestions(debouncedSlug);
          setSuggestions(newSuggestions);
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('Failed to check availability.');
      }
    }

    check();
  }, [debouncedSlug, currentSlug]);

  const handleSave = async () => {
    if (status !== 'available' && slug !== currentSlug) return;

    setIsSaving(true);
    try {
      const result = await updateSiteSlug(websiteId, slug);
      if (result.success) {
        onUpdate(slug); // Notify parent
        onClose();
      } else {
        setErrorMessage(result.error || 'Failed to update slug.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Change Website URL</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Subdomain
            </label>
            <div className="relative">
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                    // Simple client-side sanitization for display
                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                    setSlug(val);
                }}
                className={`w-full pl-4 pr-32 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium text-gray-900 ${
                  status === 'available' ? 'border-green-500 ring-1 ring-green-500 bg-green-50' :
                  status === 'taken' ? 'border-red-300 ring-1 ring-red-300 bg-red-50' :
                  'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
                placeholder="my-business-name"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none select-none">
                .bizvistaar.com
              </span>
            </div>

            {/* Status Messages */}
            <div className="mt-2 min-h-[20px] text-sm">
               {status === 'checking' && (
                 <span className="flex items-center gap-2 text-gray-500">
                   <Loader2 size={14} className="animate-spin" /> Checking availability...
                 </span>
               )}
               {status === 'available' && (
                 <span className="flex items-center gap-2 text-green-600 font-medium">
                   <Check size={14} /> Available!
                 </span>
               )}
               {status === 'taken' && (
                 <span className="flex items-center gap-2 text-red-500 font-medium">
                   <AlertCircle size={14} /> This URL is already taken.
                 </span>
               )}
               {errorMessage && (
                  <span className="flex items-center gap-2 text-red-500 font-medium">
                   <AlertCircle size={14} /> {errorMessage}
                 </span>
               )}
            </div>
          </div>

          {/* Suggestions */}
          {status === 'taken' && suggestions.length > 0 && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <p className="text-sm text-gray-600 mb-3">Try one of these available options:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlug(s)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || (status !== 'available' && slug !== currentSlug) || !slug}
            className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
