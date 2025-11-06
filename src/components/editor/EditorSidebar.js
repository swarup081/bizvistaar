'use client';

import {
  LayoutDashboard, Palette, Settings, Home, Store, Calendar, Tag, MessageCircle, Contact, Plus
} from 'lucide-react';

// Reusable tab button for the top-level navigation
const MainTab = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-full py-4 px-2 font-medium ${
      isActive 
        ? 'border-b-2 border-blue-600 text-blue-600' 
        : 'text-gray-500 hover:text-gray-900 transition-colors'
    }`}
  >
    <Icon size={22} />
    <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
  </button>
);

// Reusable button for navigation/shortcuts
const SidebarLink = ({ icon: Icon, label, isActive = false }) => (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={18} /> {label}
    </a>
);

// Reusable section title
const SectionTitle = ({ label, showAdd = false }) => (
  <div className="flex items-center justify-between mt-6 mb-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </h3>
      {showAdd && (
        <button className="text-gray-400 hover:text-blue-600">
          <Plus size={18} />
        </button>
      )}
  </div>
);

export default function EditorSidebar({ activeTab, onTabChange }) {
  return (
    <div className="w-80 flex flex-col h-full bg-white">
      {/* Main Tab Navigation */}
      <div className="flex items-center border-b border-gray-200">
        <MainTab
          icon={LayoutDashboard}
          label="Website"
          isActive={activeTab === 'website'}
          onClick={() => onTabChange('website')}
        />
        <MainTab
          icon={Palette}
          label="Theme"
          isActive={activeTab === 'theme'}
          onClick={() => onTabChange('theme')}
        />
        <MainTab
          icon={Settings}
          label="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      </div>

      {/* Conditional Content Area */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        
        {/* WEBSITE Panel */}
        {activeTab === 'website' && (
          <>
            <section>
              <SectionTitle label="Site Navigation" showAdd={true} />
              <div className="space-y-1">
                <SidebarLink icon={Home} label="Home" isActive={true} />
              </div>
            </section>

            <section>
              <SectionTitle label="Shortcuts" />
              <div className="space-y-1">
                <SidebarLink icon={Store} label="Manage Store" />
                <SidebarLink icon={Calendar} label="Manage Appointments" />
                <SidebarLink icon={Tag} label="Manage Promotions" />
                <SidebarLink icon={MessageCircle} label="Manage Chat" />
                <SidebarLink icon={Contact} label="Manage Contacts" />
              </div>
            </section>
          </>
        )}

        {/* THEME Panel (Placeholder) */}
        {activeTab === 'theme' && (
          <section>
            <SectionTitle label="Theme Settings" />
            <p className="text-gray-600 text-sm">Theme and color controls will go here.</p>
          </section>
        )}

        {/* SETTINGS Panel (Placeholder) */}
        {activeTab === 'settings' && (
          <section>
            <SectionTitle label="Site Settings" />
            <p className="text-gray-600 text-sm">SEO, Domain, and other settings will go here.</p>
          </section>
        )}

      </div>
      
      {/* "Contact Us" Button has been removed */}
      
    </div>
  );
}