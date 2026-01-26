'use client';

import { PartyPopper, Check, X, ExternalLink } from 'lucide-react';

export default function PublishSuccessModal({ isOpen, onClose, siteSlug }) {
  if (!isOpen) return null;

  const siteUrl = `https://${siteSlug}.bizvistaar.com`; // Assuming protocol

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">

        {/* Confetti / Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
            <X size={20} />
        </button>

        <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <PartyPopper size={32} className="text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Website is Live!</h2>
            <p className="text-gray-600 mb-8">
                Congratulations! Your business is now online and ready for the world to see.
            </p>

            {/* Link Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-center justify-between group hover:border-gray-300 transition-colors">
                <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Public URL</span>
                    <a
                        href={siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-bold text-blue-600 truncate max-w-full hover:underline"
                    >
                        {siteSlug}.bizvistaar.com
                    </a>
                </div>
                <a
                    href={siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors"
                >
                    <ExternalLink size={20} />
                </a>
            </div>

            {/* Note */}
            <div className="bg-blue-50 rounded-lg p-4 text-left flex gap-3">
                <div className="mt-0.5 min-w-[20px]">
                    <Check size={18} className="text-blue-600" />
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                    We are finalizing your custom subdomain setup. You will receive a DM with your permanent subdomain details shortly.
                </p>
            </div>

        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button
                onClick={onClose}
                className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-transform active:scale-[0.98]"
            >
                Done
            </button>
        </div>

      </div>
    </div>
  );
}
