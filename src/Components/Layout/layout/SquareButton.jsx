import React from 'react'; // Add this line
import { Link } from 'react-router-dom';

const SquareButton = ({ icon, text, to }) => {
  return (
    <Link to={to} className="no-underline">
      <div className="w-48 h-48 bg-white rounded-lg border-2 border-blue-500 flex flex-col items-center justify-center shadow-md cursor-pointer hover:transform hover:scale-105 transition-transform">
        <div className="mb-4">
          {React.cloneElement(icon, { className: "text-blue-500 text-3xl" })}
        </div>
        <div className="text-black text-base font-medium text-center px-2">{text}</div>
      </div>
    </Link>
  );
};

export default SquareButton;