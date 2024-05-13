import React from 'react';

export default function OtherNoContentNoon() {
  return (
    <>
      <div className="flex gap-2">
        <div className="flex flex-col items-center justify-center w-32 h-32 border border-white sm:w-48 sm:h-48 rounded-2xl">
          <h3>下午</h3>
        </div>
        <div className="hidden h-48 overflow-auto w-96 line-clamp-4 sm:block"></div>
      </div>
    </>
  );
}
