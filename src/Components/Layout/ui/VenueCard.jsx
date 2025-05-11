import { FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const VenueCard = ({ venue, to }) => {
  const content = (
    <div className="bg-white rounded-xl p-5 text-center shadow-lg border-2 border-blue-500 transition-all cursor-pointer hover:shadow-xl">
      <div className="mb-4">
        <FaCalendarAlt className="text-blue-500 text-3xl mx-auto" />
      </div>
      <div className="text-base font-semibold text-gray-800">{venue}</div>
    </div>
  );

  return to ? (
    <Link to={to} className="no-underline text-inherit">
      {content}
    </Link>
  ) : content;
};

export default VenueCard;