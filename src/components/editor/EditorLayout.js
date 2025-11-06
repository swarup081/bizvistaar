'use client';

import { useState } from 'react';
import EditorTopNav from './EditorTopNav';
import EditorSidebar from './EditorSidebar';

export default function EditorLayout({ templateName }) {
  const [view, setView] = useState('desktop'); // 'desktop' or 'mobile'
  const [activeTab, setActiveTab] = useState('website'); // 'website', 'theme', 'settings'

  // Construct the URL for the iframe preview
  const previewUrl = `/templates/${templateName}`;

  return (
    // UPDATED: Simple 2-col grid. Sidebar is now independent.
    <div className="grid grid-cols-[1fr_auto] h-screen bg-gray-50">
      
      {/* Column 1: Main Content (Nav + Preview) */}
      {/* This column will scroll if the preview is too tall */}
      <div className="flex flex-col h-screen overflow-hidden">
        
        {/* Top Nav: Stays at the top of this column */}
        <div className="flex-shrink-0">
          <EditorTopNav
            templateName={templateName}
            view={view}
            onViewChange={setView}
          />
        </div>

        {/* Main Preview Area: Fills remaining space and is scrollable */}
        <main className="flex-grow flex items-center justify-center overflow-auto ">
          <div
            className={`transition-all duration-300 ease-in-out bg-white shadow-lg rounded-xl overflow-hidden flex-shrink-0`}
            style={{
              width: view === 'desktop' ? '100%' : '375px',
              height: view ==='desktop' ? '100%' : '812px',
            }}
          >
            <iframe
              src={previewUrl}
              title="Website Preview"
              className="w-full h-full border-0"
            />
          </div>
        </main>
      </div>

      {/* Column 2: Sidebar (Full Height) */}
      {/* UPDATED: h-screen, bg-white, and border-l to separate it */}
      <div className="h-screen bg-white border-l border-gray-200 overflow-y-auto">
        <EditorSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
    </div>
  );
}