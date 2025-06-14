import React from 'react';
import { Link } from 'react-router-dom';

const SquareButton = ({ icon, text, to, onClick }) => {
  const content = (
    <div className="group relative w-56 h-56 rounded-[18px] overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#1a2552]/90 backdrop-blur-xs rounded-[16px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2552]/80 via-[#0ba9a9]/50 to-[#83c059]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
      
      {/* Main button container */}
      <div className="relative h-full w-full flex flex-col items-center border border-[#0ba9a9]/30 rounded-[15px] p-4 transition-all duration-500 group-hover:shadow-[0_10px_30px_-5px_rgba(11,169,169,0.3)] group-hover:-translate-y-1.5 group-hover:border-[#83c059]/50 overflow-hidden">
        {/* Visual effects */}
        <div className="absolute -inset-1 bg-[#83c059]/20 opacity-0 group-hover:opacity-40 blur-[12px] transition-opacity duration-700"></div>
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* Icon with fixed positioning */}
        <div className="h-20 w-full flex items-center justify-center mb-3 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 z-10">
          {React.cloneElement(icon, { 
            className: "text-4xl text-[#2596be] drop-shadow-md" 
          })}
        </div>
        
        {/* Text with perfect alignment */}
        <div className="flex-1 w-full flex items-center justify-center text-center px-1 z-10">
          <span className="text-lg font-semibold text-white group-hover:text-[#83c059] transition-colors duration-500 drop-shadow-md leading-tight">
            {text}
          </span>
        </div>
        
        {/* Animated underline */}
        <div className="absolute bottom-6 h-[3px] w-8 bg-gradient-to-r from-[#0ba9a9] to-[#83c059] opacity-0 group-hover:opacity-100 group-hover:w-20 transition-all duration-700 ease-out"></div>
      </div>
      
      {/* Reflection effect */}
      <div className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-20 group-hover:bg-white/30 mix-blend-overlay transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );

  // Render as button or link based on props
  return onClick ? (
    <button
      onClick={onClick}
      type="button"
      className="p-0 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-[#83c059]/50 focus:ring-offset-2 rounded-[16px]"
      aria-label={text}
    >
      {content}
    </button>
  ) : (
    <Link 
      to={to} 
      className="no-underline inline-block rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#83c059]/50 focus:ring-offset-2" 
      aria-label={text}
    >
      {content}
    </Link>
  );
};

export default SquareButton;