'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GridBackgroundDemo } from "@/components/GridBackgroundDemo";
import { motion } from 'framer-motion';

// --- 1. Enhanced Template Skeleton ---
const TemplateSkeleton = ({ variant }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden rounded-tl-xl">
      {/* Navbar */}
      <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="flex gap-3 items-center">
            <div className="h-8 w-8 bg-gray-900/10 rounded-md"></div>
            <div className="h-3 w-20 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex gap-4">
           <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
           <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
           <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
           <div className="h-8 w-20 bg-black/5 rounded-full"></div>
        </div>
      </div>

      <div className="flex-grow p-6 flex flex-col gap-8 overflow-y-auto no-scrollbar">
          {/* Hero Section */}
          <div className="w-full h-64 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden flex p-6 gap-6 items-center">
             {/* Hero Text */}
             <div className="w-1/2 space-y-3 z-10">
                <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-1/2 bg-gray-200 rounded-lg"></div>
                <div className="h-3 w-full bg-gray-100 rounded-lg mt-3"></div>
                <div className="h-3 w-5/6 bg-gray-100 rounded-lg"></div>
                <div className="h-10 w-28 bg-gray-900/10 rounded-full mt-4"></div>
             </div>
             {/* Hero Visual */}
             <div className="w-1/2 h-full bg-white rounded-lg border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-gray-100/50"></div>
                <div className="absolute bottom-4 right-4 h-16 w-16 bg-white rounded-lg shadow-sm border border-gray-100"></div>
             </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
                      <div className="h-8 w-8 bg-white rounded-lg shadow-sm border border-gray-100"></div>
                      <div className="h-2 w-2/3 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-gray-100 rounded-lg"></div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-lg"></div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

// --- 2. Fixed Mock Browser ---
const MockBrowser = ({ storeName, className }) => {
    const siteSlug = storeName 
        ? storeName.toLowerCase().replace(/[^a-z0-9]/g, '') 
        : 'your-site';

    return (
        <div 
            className={`absolute bg-white rounded-tl-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] border-l border-t border-gray-200 flex flex-col ${className}`}
        >
            {/* Browser Header */}
            <div className="h-10 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0 z-20 relative rounded-tl-2xl">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] border border-black/10"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/10"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] border border-black/10"></div>
                </div>
                
                {/* URL Bar */}
                <div className="flex-grow h-7 bg-gray-50 border border-gray-200 rounded-md flex items-center px-3 justify-start gap-2">
                     <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                     <span className="text-xs text-gray-500 font-normal truncate font-mono tracking-tight">
                        {siteSlug}.bizvistaar.com
                     </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow relative bg-white overflow-hidden">
                <TemplateSkeleton variant="minimal" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

export default function StepTwo() {
  const [storeName, setStoreName] = useState('');
  const [businessType, setBusinessType] = useState('restaurant');

  useEffect(() => {
    const storedBusinessType = localStorage.getItem('businessType');
    if (storedBusinessType) {
      setBusinessType(storedBusinessType);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem('storeName', storeName);
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-white">
      
      {/* --- LEFT SIDE (Form - 40%) --- */}
      <div className="w-full lg:w-[46%] flex flex-col justify-between p-16 xl:p-20 bg-white z-30 relative shadow-[20px_0_40px_-10px_rgba(0,0,0,0.03)]">
        
        {/* Logo - Matched to Get Started Page */}
        <div className="absolute top-10 left-10 text-3xl font-bold text-gray-900 not-italic tracking-tight">
            BizVistaar
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-center h-full max-w-md ml-2">
            {/* Step Indicator */}
            <p className="text-xs font-bold text-gray-400 mb-6 tracking-widest uppercase">
              Step 1 of 3
            </p>

            {/* Heading - Matched to Get Started Page */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-snug not-italic">
              What is the name of your {businessType.toLowerCase()}?
            </h2>
            
            <p className="text-gray-500 text-base mb-12">
              Don't worry, you can always change this later in your settings.
            </p>

            {/* Styled Input */}
            <div className="relative group mb-16">
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder={`e.g., ${businessType} Name`}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-300 py-3 text-xl text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:border-black transition-colors duration-300 outline-none font-medium"
                  autoFocus
                />
            </div>
        </div>

        {/* Footer / Navigation Area */}
        <div className="flex items-center justify-between w-full">
            <Link href="/get-started">
                <button className="text-gray-600 hover:text-gray-900 font-medium text-m flex items-center gap-1 transition-colors">
                ← Back
                </button>
            </Link>

            <Link href="/get-started/2" passHref className={!storeName.trim() ? "pointer-events-none" : ""}>
                <button
                    onClick={handleContinue}
                    disabled={!storeName.trim()}
                    // Matched button style from previous page
                    className="px-6 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-full hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-sm"
                >
                    Continue 
                </button>
            </Link>
        </div>
      </div>

      {/* --- RIGHT SIDE (Visuals - 60%) --- */}
      <div className="hidden lg:block lg:w-[54%] bg-gray-50 relative overflow-hidden border-l border-gray-200">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
           <GridBackgroundDemo />
        </div>

        {/* Mock Browser - Static & Positioned Bottom-Right "Coming Up" */}
        <div className="relative w-full h-full">
             <MockBrowser 
                storeName={storeName}
                // Positioned to come up from bottom-right corner
                className="absolute bottom-[-10%] right-[-10%] w-[85%] h-[85%] z-20 shadow-2xl" 
            />
        </div>
      </div>

    </div>
  );
}
