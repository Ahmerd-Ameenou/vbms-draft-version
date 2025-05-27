const VenueCardSkeleton = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="h-9 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  };
  
  export default VenueCardSkeleton;