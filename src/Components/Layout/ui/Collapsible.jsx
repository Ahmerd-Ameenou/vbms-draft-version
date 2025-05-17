import React, { useState } from 'react';

// Collapsible Trigger Component
export const CollapsibleTrigger = ({ children, onClick }) => (
  <button onClick={onClick} className="p-2">
    {children}
  </button>
);

// Collapsible Content Component
export const CollapsibleContent = ({ children, open }) => {
  return open ? (
    <div className="p-2 border-t border-gray-100">
      {children}
    </div>
  ) : null;
};

// Main Collapsible Component
export const Collapsible = ({ open, onOpenChange, children }) => {
  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          open: open,
          onOpenChange: onOpenChange,
        })
      )}
    </div>
  );
};
