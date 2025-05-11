import { useNavigate } from 'react-router-dom';

const MenuItem = ({ icon, text, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
  };

  return (
    <div 
      className="flex items-center py-3 px-6 cursor-pointer hover:bg-blue-500 transition-colors"
      onClick={handleClick}
    >
      <span className="mr-4 text-green-300">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export default MenuItem;