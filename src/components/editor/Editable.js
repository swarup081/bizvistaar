'use client';

import { useState, useEffect } from 'react';

// This is a client component that will wrap editable elements in your templates
export function Editable({ children, focusId }) {
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    // Check if we're inside an iframe (the editor)
    setIsEditor(window.self !== window.top);
  }, []);

  if (!isEditor) {
    // If on the live site, just render the children
    return children;
  }

  const handleClick = (e) => {
    // Stop the click from doing anything else (like following a link)
    e.preventDefault();
    e.stopPropagation();

    // Send a message to the parent (EditorLayout)
    window.parent.postMessage({
      type: 'FOCUS_SECTION',
      payload: {
        accordionId: focusId // e.g., "hero", "about", "products"
      }
    }, '*');
  };

  return (
    <div
      onClick={handleClick}
      title={`Click to edit ${focusId} section`}
      className="editable-outline"
      style={{
        outline: '2px dashed rgba(0, 110, 255, 0.0)', // Invisible by default
        outlineOffset: '2px',
        cursor: 'pointer',
        transition: 'outline 0.1s ease-in-out',
      }}
      onMouseOver={e => {
        e.currentTarget.style.outline = '2px dashed rgba(0, 110, 255, 0.8)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.outline = '2px dashed rgba(0, 110, 255, 0.0)';
      }}
    >
      {children}
    </div>
  );
}