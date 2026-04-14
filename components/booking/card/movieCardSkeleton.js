import React from 'react';

const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-0 w-[280px] h-[460px] animate-pulse rounded-2xl overflow-hidden border border-white/5 bg-gray-900/50">
      {/* Poster Image Skeleton */}
      <div className="skeleton h-[320px] w-full rounded-none bg-gray-800/50"></div>
      
      <div className="flex flex-col gap-3 p-4">
        {/* Title Skeleton */}
        <div className="skeleton h-5 w-3/4 bg-gray-800"></div>
        
        {/* Sub Info Skeleton */}
        <div className="flex gap-2 items-center">
          <div className="skeleton h-5 w-16 rounded-full bg-gray-800"></div>
          <div className="skeleton h-4 w-12 bg-gray-800"></div>
        </div>
        
        {/* Footer Skeleton */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
          <div className="skeleton h-3 w-12 bg-gray-800"></div>
          <div className="skeleton h-7 w-20 rounded-full bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
