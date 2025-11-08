'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import EditorTopNav from './EditorTopNav';
import EditorSidebar from './EditorSidebar';

// Import all template data
import { businessData as flaraData } from '@/app/templates/flara/data.js';
import { businessData as avenixData } from '@/app/templates/avenix/data.js';
import { businessData as blisslyData } from '@/app/templates/blissly/data.js';
import { businessData as flavornestData } from '@/app/templates/flavornest/data.js';

const templateDataMap = {
  flara: flaraData,
  avenix: avenixData,
  blissly: blisslyData,
  flavornest: flavornestData,
  // Add other templates here as they are created
};

export default function EditorLayout({ templateName }) {
  const [view, setView] = useState('desktop');
  const [activeTab, setActiveTab] = useState('website');
  const iframeRef = useRef(null);
  
  // --- STATE LIFTED UP ---
  const [activeAccordion, setActiveAccordion] = useState('global'); 
  // --- END OF CHANGE ---

  const editorDataKey = `editorData_${templateName}`;
  const cartDataKey = `${templateName}Cart`; 

  const defaultData = useMemo(() => {
    return JSON.parse(JSON.stringify(templateDataMap[templateName] || {}));
  }, [templateName]);

  const [businessData, setBusinessData] = useState(defaultData);
  const [history, setHistory] = useState([defaultData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(editorDataKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setBusinessData(parsedData); 
        setHistory([parsedData]);
        setHistoryIndex(0);
      } else {
        setBusinessData(defaultData);
        setHistory([defaultData]);
        setHistoryIndex(0);
      }
    } catch (error) {
      console.error("Failed to load saved data:", error);
      setBusinessData(defaultData);
      setHistory([defaultData]);
      setHistoryIndex(0);
    }
  }, [templateName, defaultData, editorDataKey]); 

  useEffect(() => {
    try {
      const dataToSave = JSON.stringify(businessData);
      localStorage.setItem(editorDataKey, dataToSave);
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, [businessData, editorDataKey]);

  
  const handleDataUpdate = (updaterFn) => {
    setBusinessData(prevData => {
      const newData = typeof updaterFn === 'function' ? updaterFn(prevData) : updaterFn;
      if (JSON.stringify(newData) === JSON.stringify(prevData)) {
        return prevData;
      }
      const newHistory = [...history.slice(0, historyIndex + 1), newData];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return newData;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBusinessData(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBusinessData(history[newIndex]);
    }
  };

  const handleRestart = () => {
    localStorage.removeItem(editorDataKey);
    localStorage.removeItem(cartDataKey);
    setBusinessData(defaultData);
    setHistory([defaultData]);
    setHistoryIndex(0);
    sendDataToIframe(defaultData);
    const homePage = defaultData.pages?.[0]?.path || `/templates/${templateName}`;
    handlePageChange(homePage);
  };

  const sendDataToIframe = (data) => {
    if (iframeRef.current && data) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_DATA',
        payload: data,
      }, '*');
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      sendDataToIframe(businessData);
    }, 250); 

    return () => clearTimeout(handler);
  }, [businessData]); 

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'IFRAME_READY') {
        sendDataToIframe(businessData);
      }
      
      if (event.data.type === 'FOCUS_SECTION') {
        setActiveTab('website');
        setActiveAccordion(event.data.payload.accordionId);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [businessData]); 

  const [activePage, setActivePage] = useState(defaultData?.pages?.[0]?.path || `/templates/${templateName}`);
  const [previewUrl, setPreviewUrl] = useState(defaultData?.pages?.[0]?.path || `/templates/${templateName}`);
  
  const handlePageChange = (path) => {
    if (!path) return; 
    
    const [basePath, anchorId] = path.split('#');
    setActivePage(path); 

    if (iframeRef.current) {
      const currentBasePath = iframeRef.current.src.split('#')[0];

      if (currentBasePath.endsWith(basePath) && anchorId) {
        iframeRef.current.contentWindow.postMessage({
          type: 'SCROLL_TO_SECTION',
          payload: { sectionId: anchorId }
        }, '*');
      } else if (!currentBasePath.endsWith(basePath)) {
        setPreviewUrl(path);
      } else if (currentBasePath.endsWith(basePath) && !anchorId) {
        setPreviewUrl(basePath);
      }
    }
  };
  
  useEffect(() => {
      const homePage = defaultData.pages?.[0]?.path || `/templates/${templateName}`;
      setActivePage(homePage);
      setPreviewUrl(homePage);
  }, [templateName, defaultData]);

  const handleAccordionToggle = (id) => {
    const newActiveId = activeAccordion === id ? null : id;
    setActiveAccordion(newActiveId);

    if (newActiveId) {
      if (newActiveId === 'products') {
        const shopPage = businessData.pages.find(
          (p) => p.name.toLowerCase() === 'shop'
        );
        if (shopPage) {
          handlePageChange(shopPage.path);
        }
      } else {
        const sectionIdMap = {
          hero: 'home',
          global: 'home',
          about: businessData.aboutSectionId || 'about',
          events: businessData.eventsSectionId || 'events',
          menu: businessData.menuSectionId || 'menu',
          testimonials: businessData.testimonialsSectionId || 'testimonials',
          collection: businessData.collectionSectionId || 'collection',
          feature2: businessData.feature2SectionId || 'feature2',
          footer: businessData.footerSectionId || 'contact',
          cta: businessData.ctaSectionId || 'cta',
          stats: businessData.statsSectionId || 'stats',
          blog: businessData.blogSectionId || 'blog',
          reviews: businessData.reviewsSectionId || 'reviews',
          specialty: businessData.specialtySectionId || 'specialty',
        };
        const sectionId = sectionIdMap[id] || (id !== 'products' ? id : null);
        
        if (sectionId) {
          const homePage = businessData.pages.find(p => p.name.toLowerCase() === 'home');
          const homePath = homePage?.path || businessData.pages[0]?.path;
          
          // --- THIS IS THE RUNTIME ERROR FIX ---
          // It now calls handlePageChange (defined above) instead of onPageChange
          handlePageChange(sectionId === 'home' ? homePath : `${homePath}#${sectionId}`);
          // --- END OF FIX ---
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-[1fr_auto] h-screen bg-gray-50">
      
      {/* Column 1: Main Content (Nav + Preview) */}
      <div className="flex flex-col h-screen overflow-hidden">
        
        <div className="flex-shrink-0">
          <EditorTopNav
            templateName={templateName}
            view={view}
            onViewChange={setView}
            activePage={activePage}
            pages={businessData?.pages || []}
            onPageChange={handlePageChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onRestart={handleRestart}
          />
        </div>

        <main className="flex-grow flex items-center justify-center overflow-auto ">
          <div
            className={`transition-all duration-300 ease-in-out bg-white shadow-lg rounded-xl overflow-hidden flex-shrink-0`}
            style={{
              width: view === 'desktop' ? '100%' : '375px',
              height: view ==='desktop' ? '100%' : '812px',
            }}
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title="Website Preview"
              className="w-full h-full border-0"
              key={templateName} 
            />
          </div>
        </main>
      </div>

      {/* Column 2: Sidebar (Full Height) */}
      <div className="h-screen bg-white border-l border-gray-200 overflow-y-auto">
        <EditorSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          businessData={businessData}
          setBusinessData={handleDataUpdate} 
          onPageChange={handlePageChange}
          
          activeAccordion={activeAccordion}
          onAccordionToggle={handleAccordionToggle} 
        />
      </div>
    </div>
  );
}