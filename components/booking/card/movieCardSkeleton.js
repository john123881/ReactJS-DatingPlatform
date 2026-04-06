import React from 'react';

const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-[280px] h-[550px] animate-pulse">
      {/* Poster Image Skeleton */}
      <div className="skeleton h-[400px] w-full rounded-xl bg-gray-800"></div>
      
      <div className="flex flex-col gap-4 p-4">
        {/* Title Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="skeleton h-4 w-3/4 bg-gray-800"></div>
          <div className="skeleton h-4 w-1/2 bg-gray-800"></div>
        </div>
        
        {/* Badges Skeleton */}
        <div className="flex gap-2 mt-2">
          <div className="skeleton h-6 w-20 rounded-full bg-gray-800"></div>
          <div className="skeleton h-6 w-20 rounded-full bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
