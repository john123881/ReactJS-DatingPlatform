import { useState } from 'react';
import { FiInfo, FiFileText, FiPlusCircle } from 'react-icons/fi';

export default function SharedTripWorkspace({ 
  tripName, 
  onJoinClick 
}) {
  const [activeTab, setActiveTab] = useState('description'); // 'description' or 'notes'

  return (
    <div className="flex flex-col h-auto w-full lg:w-[480px] border border-white/20 rounded-[32px] overflow-hidden bg-black/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate__animated animate__fadeInRight flex-shrink-0 mb-20 origin-right transition-all duration-500">
      {/* Tab Headers */}
      <div className="flex p-2 gap-1 bg-white/5">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${
            activeTab === 'description' 
              ? 'text-black bg-neongreen shadow-[0_0_20px_rgba(57,255,20,0.4)]' 
              : 'text-white/40 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <FiInfo className={`text-xl ${activeTab === 'description' ? 'text-black' : 'text-white/40'}`} />
          <span>行程介紹</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${
            activeTab === 'notes' 
              ? 'text-black bg-neongreen shadow-[0_0_20px_rgba(57,255,20,0.4)]' 
              : 'text-white/40 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <FiFileText className={`text-xl ${activeTab === 'notes' ? 'text-black' : 'text-white/40'}`} />
          <span>行程筆記</span>
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="relative flex-grow overflow-y-auto max-h-[60vh] custom-scrollbar">
        <div className="p-6 sm:p-8">
          {/* 行程介紹 */}
          <div className={`${activeTab === 'description' ? 'block' : 'hidden'} animate__animated animate__fadeIn animate__faster`}>
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-neongreen rounded-full shadow-[0_0_8px_#39FF14]"></div>
                <h3 className="text-white font-black text-sm uppercase tracking-widest italic">Trip Overview</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[150px]">
                {tripName?.trip_description ? (
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{tripName.trip_description}</p>
                ) : (
                  <p className="text-white/20 italic text-center py-10">此行程尚未提供描述</p>
                )}
              </div>
            </div>
          </div>

          {/* 行程筆記 */}
          <div className={`${activeTab === 'notes' ? 'block' : 'hidden'} animate__animated animate__fadeIn animate__faster`}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-neongreen rounded-full shadow-[0_0_8px_#39FF14]"></div>
                <h3 className="text-white font-black text-sm uppercase tracking-widest italic">Private Notes</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[150px]">
                {tripName?.trip_notes ? (
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{tripName.trip_notes}</p>
                ) : (
                  <p className="text-white/20 italic text-center py-10">此行程尚未提供筆記</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Area */}
      <div className="p-6 pt-0">
        <button
          onClick={onJoinClick}
          className="group relative flex items-center justify-center w-full bg-neongreen hover:bg-white text-black font-black text-xl py-5 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(57,255,20,0.3)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.4)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <span className="relative z-10 flex items-center gap-3">
            <FiPlusCircle className="text-2xl" />
            加入我的日曆
          </span>
        </button>
        <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-4">
          Click above to experience this itinerary
        </p>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(57, 255, 20, 0.2);
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0);
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(57, 255, 20, 0.4);
        }
      `}</style>
    </div>
  );
}
