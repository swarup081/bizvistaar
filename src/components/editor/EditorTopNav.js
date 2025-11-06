'use client';

import {
  Monitor, Smartphone, Eye, ChevronDown, Rocket
} from 'lucide-react';

// A simple reusable button component for the nav
const NavButton = ({ children, className = '', ...props }) => (
  <button
    className={`flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

// --- Custom SVG Icons ---
const IconUndo = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

const IconRedo = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
  </svg>
);
// --- End Custom Icons ---

// --- UPDATED: Reusable Vertical Separator ---
const VerticalSeparator = () => (
  // UPDATED: Changed h-6 to h-[50px] for full height
  <div className="w-px h-[50px] bg-gray-300"></div>
);
// --- End Separator ---


export default function EditorTopNav({ templateName, view, onViewChange }) {
  const currentPage = 'Home';
  const siteUrl = `https://www.bizvistar.com/mysite/${templateName}`;

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top-most Bar (Wix, Hire, Help, Actions) */}
      <div className="w-full h-[65px] border-b border-gray-200 px-4 flex items-center justify-between">
        {/* Left Side: Logo, Nav */}
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-gray-900">
            BizVistar
          </div>
          <div className="flex items-center gap-2">
            <NavButton>Hire a Professional</NavButton>
            <NavButton>Help</NavButton>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-purple-600 px-3 py-2 rounded-md">
            Upgrade
          </button>
          <div className="w-px h-5 bg-gray-300"></div> 
          <NavButton>
            Save
          </NavButton>
          <button className="text-sm font-medium text-blue-500 px-3 py-2 rounded-md">
            Preview
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-4xl hover:bg-blue-700 transition-colors">
            Publish
          </button>
        </div>
      </div>

      {/* Second Bar (Page, Devices, URL, Tools) */}
      {/* This 'items-center' will vertically center the 50px tall separators */}
      <div className="w-full h-[50px] border-b border-gray-200 px-4 flex items-center">
        
        {/* Left: Page & Devices */}
        <div className="flex items-center gap-4">
          {/* Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Page:</span>
            <button className="flex items-center gap-1 font-medium text-gray-900">
              {currentPage}
              <ChevronDown size={16} />
            </button>
          </div>

          <VerticalSeparator />

          {/* Device Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewChange('desktop')}
              className={`p-2 rounded-md ${view === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 '}`}
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={() => onViewChange('mobile')}
              className={`p-2 rounded-md ${view === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 '}`}
            >
              <Smartphone size={20} />
            </button>
          </div>

          <VerticalSeparator />
        </div>

        {/* Center: URL Bar (Fills remaining space) */}
        <div className="flex-grow min-w-0 mx-4">
          <div className="bg-gray-50 border border-gray-300 rounded-4xl px-3 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
            {siteUrl}
            <span className="text-purple-600 ml-2 font-medium">Connect Your Domain</span>
          </div>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-2 text-gray-600">
          <VerticalSeparator />

          <button className="p-2  rounded-md text-gray-500 ">
            <IconUndo />
          </button>
          <button className="p-2  rounded-md  ">
            <IconRedo />
          </button>
        </div>
      </div>
    </header>
  );
}