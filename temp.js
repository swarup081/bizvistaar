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

const DesktopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
  </svg>
);

const MobileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5h-2.25m-3.75 0h3.75M12 18.75h.008v.008H12v-.008z" />
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
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      
      {/* --- Top Navigation Bar --- */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Back Button (goes back to /templates) */}
            <Link href="/templates">
              <button 
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <BackIcon />
                Back to Templates
              </button>
            </Link>

            {/* Device Toggles */}
            <div className="flex items-center gap-2 p-1 rounded-lg bg-gray-100 border border-gray-200">
              <button
                onClick={() => setView('desktop')}
                className={`p-1.5 rounded-md transition-colors ${view === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                aria-label="Desktop view"
              >
                <DesktopIcon />
              </button>
              <button
                onClick={() => setView('mobile')}
                className={`p-1.5 rounded-md transition-colors ${view === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                aria-label="Mobile view"
              >
                <MobileIcon />
              </button>
            </div>
            
            {/* Action Button */}
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
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 overflow-hidden">
          <div 
              className={`transition-all duration-300 ease-in-out ${view === 'desktop' ? 'w-full h-full' : 'w-[375px] h-[750px] flex-shrink-0'}`}
           >
              <iframe
                  src={templateUrl}
                  title={`${templateName} Preview`}
                  className="w-full h-full bg-white border border-gray-300 rounded-lg shadow-2xl"
              />
          </div>
      </main>
    </div>
  );
}