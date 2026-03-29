import Link from 'next/link';
import { useState } from 'react';
import TripNoteModal from '../common/trip-note-modal';

/**
 * 輔助函式：將中文標題截斷為指定長度
 */
function truncateChinese(title, maxChineseChars = 7) {
  if (typeof title !== 'string') return '';
  let count = 0;
  let res = '';
  for (const char of title) {
    if (char.match(/[\u4e00-\u9fff]/)) count++;
    if (count > maxChineseChars) return res + '...';
    res += char;
  }
  return res;
}

export default function TripSidebarBase({ 
  tripName, 
  titlePrefix = '行程規劃',
  backLink,
  backLabel,
  usernamePrefix = '',
  children 
}) {
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const formattedDate = tripName?.trip_date
    ? new Date(tripName.trip_date).toLocaleDateString('en-CA')
    : '';

  return (
    <div className="pt-16 pb-3 border-b-2 border-white max-w-7xl mx-auto px-4">
      {/* Desktop View */}
      <div className="hidden sm:block">
        <p className="mb-2 text-5xl">{titlePrefix}</p>
        <div className="flex justify-between items-center pr-2.5">
          <div className="flex items-center min-h-[40px]">
            {tripName?.trip_title ? (
              <h3 className="mr-8 text-2xl tooltip font-medium" data-tip={tripName.trip_title}>
                {truncateChinese(tripName.trip_title)}
              </h3>
            ) : (
              <div className="skeleton h-8 w-32 mr-8 bg-white/10"></div>
            )}
            
            {tripName?.trip_date ? (
              <h3 className="mr-8 text-2xl font-medium">{formattedDate}</h3>
            ) : (
              <div className="skeleton h-8 w-32 mr-8 bg-white/10"></div>
            )}

            {tripName.username && (
              <h3 className="mr-8 text-2xl">{usernamePrefix}{tripName.username}</h3>
            )}
            {children}
          </div>
          <Link className="hover:text-[#a0ff1f] text-2xl" href={backLink}>
            {backLabel}
          </Link>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col gap-2.5 mx-5 sm:hidden">
        <div className="flex flex-col gap-1 min-h-[48px]">
          {tripName?.trip_title ? (
            <div className="text-base text-white">{tripName.trip_title}</div>
          ) : (
            <div className="skeleton h-5 w-40 mb-1 bg-white/10"></div>
          )}
          
          {tripName?.trip_date ? (
            <div className="text-base text-white">{formattedDate}</div>
          ) : (
            <div className="skeleton h-5 w-32 bg-white/10"></div>
          )}
        </div>
        {tripName.username && (
          <div className="text-base text-white">{usernamePrefix}{tripName.username}</div>
        )}
        <div className="flex gap-5">
           <button
            onClick={() => setIsNoteOpen(true)}
            className="text-xs bg-black px-2 py-1 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black"
          >
            閱讀行程筆記
          </button>
          {children}
        </div>
        <Link className="hover:text-[#a0ff1f] self-end" href={backLink}>
          {backLabel}
        </Link>
      </div>

      <TripNoteModal 
        isOpen={isNoteOpen} 
        onClose={() => setIsNoteOpen(false)} 
        tripName={tripName} 
      />
    </div>
  );
}
