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
  canEdit = false,
  onUpdateSuccess,
  children 
}) {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);

  const formattedDate = tripName?.trip_date
    ? new Date(tripName.trip_date).toLocaleDateString('en-CA')
    : '';

  return (
    <div className="pt-20 pb-8 border-b border-white/20 w-full max-w-[1600px] mx-auto px-6 sm:px-10 transition-all duration-500">
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-6">
          <div className="flex flex-col items-start text-left">
            <h1 className="text-xl font-medium text-white/30 tracking-[0.2em] mb-2 uppercase">
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

              {tripName?.username && (
                <h3 className="text-2xl text-gray-400 font-medium">
                  {usernamePrefix}<span className="text-white ml-2">{tripName.username}</span>
                </h3>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-4">
              {canEdit && (
                 <button
                  onClick={() => setIsNoteOpen(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white font-bold transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  編輯行程資訊
                </button>
              )}
              <Link 
                className="flex items-center gap-2 text-xl font-bold text-gray-400 hover:text-neongreen transition-colors group" 
                href={backLink}
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> {backLabel}
              </Link>
            </div>
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
          
          {tripName?.username && (
            <div className="text-lg text-gray-400">{usernamePrefix}{tripName.username}</div>
          )}
        </div>

        {/* 可展開的簡介面板 (手機版專用) */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isIntroExpanded ? 'max-h-[1000px] opacity-100 mb-2' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl flex flex-col gap-6 shadow-2xl">
            <div className="space-y-2">
              <p className="text-xs font-bold text-neongreen uppercase tracking-widest ml-1">行程描述</p>
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 text-white/80 leading-relaxed min-h-[80px]">
                {tripName?.trip_description || <span className="text-white/20 italic">尚未填寫行程描述</span>}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-bold text-neongreen uppercase tracking-widest ml-1">行程筆記</p>
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 text-white/80 leading-relaxed min-h-[80px]">
                {tripName?.trip_notes || <span className="text-white/20 italic">尚未填寫行程筆記</span>}
              </div>
            </div>

            {canEdit && (
              <button
                onClick={() => {
                  setIsIntroExpanded(false);
                  setIsNoteOpen(true);
                }}
                className="mt-2 w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                進入編輯模式
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
           <button
            onClick={() => setIsIntroExpanded(!isIntroExpanded)}
            className={`text-base font-bold px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              isIntroExpanded 
                ? 'bg-white text-black shadow-glow-white' 
                : 'bg-neongreen text-black shadow-glow-green'
            }`}
          >
            {isIntroExpanded ? (
              <>收合詳細資訊 <span className="text-xs">▲</span></>
            ) : (
              <>{canEdit ? '編輯行程資訊' : '閱讀行程簡介'} <span className="text-xs">▼</span></>
            )}
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
        onUpdateSuccess={onUpdateSuccess}
      />
    </div>
  );
}
