'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// --- Reusable SVG Icons ---
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

// --- UPDATED DESKTOP ICON (Cleaner "Laptop" icon) ---
const DesktopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-10"
  >
    <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9h16Z" />
    <path d="M12 16v4" />
    <path d="M8 20h8" />
  </svg>
);

// --- UPDATED MOBILE ICON (Cleaner "Smartphone" icon) ---
const MobileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

// --- Main Preview Page Component ---
export default function TemplatePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { templateName } = params; // This will be 'flavornest', 'lanily', etc.

  const [view, setView] = useState('desktop'); // 'desktop' or 'mobile'

  // Construct the URL for the iframe source.
  // This now correctly points to your existing template page, e.g., /templates/flavornest
  const templateUrl = `/templates/${templateName}`;

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      
      {/* --- Top Navigation Bar --- */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left Group: Back Button + Device Toggles */}
            <div className="flex items-center gap-6">
              {/* Back Button (goes back to /templates) */}
              <Link href="/templates">
                <button 
                  className="flex items-center gap-2 text-lg text-gray-600 hover:text-gray-900 font-medium"
                >
                  <BackIcon />
                  Back to Templates
                </button>
              </Link>

              {/* Device Toggles */}
              <div className="flex items-center gap-3 justify-items-start ">
                <button
                  onClick={() => setView('desktop')}
                  className={`p-2 transition-colors ${view === 'desktop' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-700'}`}
                  aria-label="Desktop view"
                >
                  <DesktopIcon />
                </button>
                
                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-300"></div>

                <button
                  onClick={() => setView('mobile')}
                  className={`p-2 transition-colors ${view === 'mobile' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-700'}`}
                  aria-label="Mobile view"
                >
                  <MobileIcon />
                </button>
              </div>
            </div>
            
            {/* Action Button (Pushed to the right) */}
            <div className="flex items-center gap-4">
                 <p className="text-sm text-gray-500 hidden sm:block">No credit card required*</p>
                 <Link href={`/get-started`}>
                    <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                        Start Editing
                    </button>
                 </Link>
            </div>

          </div>
        </div>
      </header>
      
      {/* --- Iframe Content Area --- */}
      <main className="flex-grow flex items-center justify-center overflow-hidden bg-gray-50">
          
          {/* Desktop View */}
          <div 
              className={`w-full h-full transition-all duration-300 ease-in-out ${view === 'desktop' ? 'opacity-100' : 'opacity-0 hidden'}`}
           >
              <iframe
                  src={templateUrl}
                  title={`${templateName} Desktop Preview`}
                  className="w-full h-full bg-white border border-gray-200 shadow-lg"
              />
          </div>

          {/* Mobile Simulator View */}
          <div
            className={`transition-all duration-300 ease-in-out ${view === 'mobile' ? 'opacity-100' : 'opacity-0 hidden'}`}
          >
            {/* Reduced width and height for a smaller simulator */}
            <div className="w-[320px] h-[660px] bg-black border-8 border-black rounded-[40px] shadow-2xl overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
              {/* Iframe content */}
              <iframe
                src={templateUrl}
                title={`${templateName} Mobile Preview`}
                className="w-full h-full bg-white rounded-[32px] overflow-hidden"
              />
              {/* Home bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>

      </main>
    </div>
  );
}