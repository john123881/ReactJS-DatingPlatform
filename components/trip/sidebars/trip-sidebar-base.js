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
    <div className="pt-20 pb-8 border-b border-white/20 max-w-screen-2xl mx-auto px-6 sm:px-12 transition-all duration-500">
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-6">
          <div className="flex flex-col items-start">
            <h1 className="text-4xl font-black text-white/50 tracking-tighter mb-1 drop-shadow-sm">
              {titlePrefix}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              {tripName?.trip_title ? (
                <div className="relative group">
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-neongreen group-hover:to-white transition-all duration-300">
                    {truncateChinese(tripName.trip_title, 12)}
                  </h3>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neongreen group-hover:w-full transition-all duration-300"></div>
                </div>
              ) : (
                <div className="skeleton animate-pulse h-10 w-48 bg-white/5 rounded-lg"></div>
              )}

              <div className="h-8 w-px bg-white/20 mx-2"></div>

              {tripName?.trip_date ? (
                <div className="px-6 py-2 border border-neongreen/50 bg-neongreen/5 rounded-full shadow-[0_0_15px_rgba(160,255,31,0.1)]">
                  <h3 className="text-2xl font-black text-neongreen tracking-widest">{formattedDate}</h3>
                </div>
              ) : (
                <div className="skeleton animate-pulse h-10 w-40 bg-white/5 rounded-full"></div>
              )}

              {tripName.username && (
                <h3 className="text-2xl text-gray-400 font-medium">
                  {usernamePrefix}<span className="text-white ml-2">{tripName.username}</span>
                </h3>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <Link 
              className="flex items-center gap-2 text-xl font-bold text-gray-400 hover:text-neongreen transition-colors group" 
              href={backLink}
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> {backLabel}
            </Link>
            {children}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col gap-6 sm:hidden">
        <h1 className="text-5xl font-black text-white">{titlePrefix}</h1>
        <div className="flex flex-col gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
          {tripName?.trip_title ? (
            <div className="text-2xl font-bold text-neongreen">{tripName.trip_title}</div>
          ) : (
            <div className="skeleton animate-pulse h-6 w-full bg-white/10 rounded"></div>
          )}
          
          {tripName?.trip_date ? (
            <div className="text-xl font-medium text-white/80">{formattedDate}</div>
          ) : (
            <div className="skeleton animate-pulse h-6 w-32 bg-white/10 rounded"></div>
          )}
          
          {tripName.username && (
            <div className="text-lg text-gray-400">{usernamePrefix}{tripName.username}</div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
           <button
            onClick={() => setIsNoteOpen(true)}
            className="text-base font-bold bg-neongreen text-black px-6 py-2 rounded-full hover:shadow-glow-green transition-all"
          >
            閱讀行程筆記
          </button>
          {children}
          <Link className="text-lg font-bold text-neongreen border-b border-neongreen" href={backLink}>
            {backLabel}
          </Link>
        </div>
      </div>

      <TripNoteModal 
        isOpen={isNoteOpen} 
        onClose={() => setIsNoteOpen(false)} 
        tripName={tripName} 
      />
    </div>
  );
}
