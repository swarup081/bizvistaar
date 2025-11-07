'use client';

import { useState } from 'react';
import {
  Monitor, Smartphone, ChevronDown, Rocket, CheckCircle
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

const VerticalSeparator = () => (
  <div className="w-px h-[50px] bg-gray-300"></div>
);

// --- UPDATED Tooltip Component ---
const Tooltip = ({ children, title, description, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Use custom 'content' prop if provided, otherwise build from title/description
  const tooltipContent = content ? (
    content
  ) : (
    <>
      <h3 className="font-semibold text-gray-900 text-base mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </>
  );

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* The trigger element */}
      {children}
      
      {/* The tooltip popup */}
      {isVisible && (
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-20 w-72 bg-white p-4 rounded-lg shadow-xl ring-1 ring-gray-900/5"
        >
          {/* Arrow (pointing up) */}
          <svg 
            className="absolute bottom-full left-1/2 -translate-x-1/2 w-4 h-4 text-white"
            // This drop shadow makes the arrow blend with the box shadow
            style={{ filter: 'drop-shadow(0 -1px 1px rgb(0 0 0 / 0.05))' }}
            viewBox="0 0 16 8" 
            fill="currentColor"
          >
             <path d="M0 8 L8 0 L16 8" />
          </svg>
          
          {tooltipContent}
        </div>
      )}
    </div>
  );
};
// --- End Tooltip Component ---


export default function EditorTopNav({ 
    templateName, 
    view, 
    onViewChange, 
    activePage, 
    pages, 
    onPageChange,
    // --- Added Undo/Redo props ---
    onUndo,
    onRedo,
    canUndo,
    canRedo
}) {
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  
  const currentPageName = pages.find(p => p.path === activePage)?.name || 'Home';
  const siteUrl = `https://www.bizvistar.com/mysite/${templateName}`;

  const handlePageSelect = (path) => {
    onPageChange(path);
    setIsPageDropdownOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top-most Bar */}
      <div className="w-full h-[65px] border-b border-gray-200 px-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-gray-900">
            BizVistar
          </div>
          <div className="flex items-center gap-2">
            <Tooltip
              title="Hire a Professional"
              description="Need help with design or content? Our experts are here to assist."
            >
              <NavButton>Hire a Professional</NavButton>
            </Tooltip>
            {/* "Help" button with no Tooltip */}
            <NavButton>Help</NavButton>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          
          {/* --- "Upgrade" Button changed to "Restart" --- */}
          <Tooltip
            title="Restart"
            description="Start over. This will take you back to the first step to pick a new business type."
          >
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md transition-colors">
              Restart
            </button>
          </Tooltip>

          <div className="w-px h-5 bg-gray-300"></div> 
          
          <Tooltip
            title="Save"
            description="Save your changes. Your site won't be live until you publish."
          >
            <NavButton>
              Save
            </NavButton>
          </Tooltip>

          {/* --- Preview Button with Tooltip --- */}
          <Tooltip
            title="Preview"
            description="See what your live site will look like to visitors."
          >
            <NavButton className="text-blue-500">
              Preview
            </NavButton>
          </Tooltip>
          
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-4xl hover:bg-blue-700 transition-colors">
            Publish
          </button>
        </div>
      </div>

      {/* Second Bar */}
      <div className="w-full h-[50px] border-b border-gray-200 px-4 flex items-center">
        
        {/* Left: Page & Devices */}
        <div className="flex items-center gap-4">
          
          {/* --- Page Selector (No Tooltip) --- */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page:</span>
              <button 
                onClick={() => setIsPageDropdownOpen(prev => !prev)}
                className="flex items-center gap-1 font-medium text-gray-900"
              >
                {currentPageName}
                <ChevronDown size={16} />
              </button>
            </div>
            {/* Page Dropdown */}
            {isPageDropdownOpen && (
              <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {pages.map(page => (
                  <button
                    key={page.path}
                    onClick={() => handlePageSelect(page.path)}
                    className={`w-full text-left px-3 py-2 text-sm ${activePage === page.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} hover:bg-gray-100`}
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            )}
          </div>


          <VerticalSeparator />

          {/* Device Toggles with Tooltips */}
          <div className="flex items-center gap-2">
            <Tooltip title="Desktop View" description="See how your site looks on a computer.">
              <button
                onClick={() => onViewChange('desktop')}
                className={`p-2 rounded-md ${view === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 '}`}
              >
                <Monitor size={20} />
              </button>
            </Tooltip>
            <Tooltip title="Mobile View" description="See how your site looks on a phone.">
              <button
                onClick={() => onViewChange('mobile')}
                className={`p-2 rounded-md ${view === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 '}`}
              >
                <Smartphone size={20} />
              </button>
            </Tooltip>
          </div>

          <VerticalSeparator />
        </div>

        {/* Center: URL Bar with Tooltip (Restored full size) */}
        <div className="flex-grow min-w-0 mx-4">
          <Tooltip
            title="Your Site Address"
            description="This is your temporary website URL. Click 'Connect Your Domain' to use a custom address."
          >
            <div className="bg-gray-50 border border-gray-300 rounded-4xl px-3 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
              {siteUrl}
              <span className="text-purple-600 ml-2 font-medium">Connect Your Domain</span>
            </div>
          </Tooltip>
        </div>

        {/* --- UPDATED: Right: Tools (Undo/Redo) with conditional Tooltips --- */}
        <div className="flex items-center gap-2 text-gray-600">
          <VerticalSeparator />
          
          {/* Undo Button */}
          {canUndo ? (
            <Tooltip title="Undo" description="Undo your last action.">
              <button 
                onClick={onUndo}
                className="p-2 rounded-md text-gray-500"
                aria-label="Undo"
              >
                <IconUndo />
              </button>
            </Tooltip>
          ) : (
            <button 
              disabled
              className="p-2 rounded-md text-gray-300 " // Visibly disabled but no block icon
              aria-label="Undo (disabled)"
            >
              <IconUndo />
            </button>
          )}

          {/* Redo Button */}
          {canRedo ? (
            <Tooltip title="Redo" description="Redo an action you undid.">
              <button 
                onClick={onRedo}
                className="p-2 rounded-md text-gray-500"
                aria-label="Redo"
              >
                <IconRedo />
              </button>
            </Tooltip>
          ) : (
             <button 
              disabled
              className="p-2 rounded-md text-gray-300 " // Visibly disabled but no block icon
              aria-label="Redo (disabled)"
            >
              <IconRedo />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}