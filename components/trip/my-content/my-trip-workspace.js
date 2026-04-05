import { useState } from 'react';
import MyTripDetailSection from './my-trip-detail-section';
import BarPhotoCarousel from '../carousel/bar-photo-carousel';
import MoviePhotoCarousel from '../carousel/movie-photo-carousel';
import { FiEdit3, FiCompass } from 'react-icons/fi';

export default function MyTripWorkspace({ 
  tripName, 
  onUpdateSuccess, 
  trip_plan_id, 
  newDetail, 
  refreshAllDetails 
}) {
  const [activeTab, setActiveTab] = useState('explore'); // 'notes' or 'explore'

  return (
    <div className="flex flex-col h-auto w-full lg:w-[480px] border border-white/20 rounded-[32px] overflow-hidden bg-black/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate__animated animate__fadeInRight flex-shrink-0 mb-20 origin-right transition-all duration-500">
      {/* Tab Headers - Figma Style */}
      <div className="flex p-2 gap-1 bg-white/5">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${
            activeTab === 'notes' 
              ? 'text-black bg-neongreen shadow-[0_0_20px_rgba(57,255,20,0.4)]' 
              : 'text-white/40 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <FiEdit3 className={`text-xl ${activeTab === 'notes' ? 'text-black' : 'text-white/40'}`} />
          <span>行程筆記</span>
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${
            activeTab === 'explore' 
              ? 'text-black bg-neongreen shadow-[0_0_20px_rgba(57,255,20,0.4)]' 
              : 'text-white/40 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <FiCompass className={`text-xl ${activeTab === 'explore' ? 'text-black' : 'text-white/40'}`} />
          <span>探索推薦</span>
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="relative flex-grow overflow-y-auto max-h-[85vh] custom-scrollbar">
        <div className="p-4 sm:p-6">
          {/* 行程筆記 內容 */}
          <div className={`${activeTab === 'notes' ? 'block' : 'hidden'} animate__animated animate__fadeIn animate__faster`}>
            <MyTripDetailSection 
              tripName={tripName} 
              onUpdateSuccess={onUpdateSuccess} 
              isEmbedded={true} 
            />
          </div>

          {/* 探索推薦 內容 */}
          <div className={`${activeTab === 'explore' ? 'flex' : 'hidden'} flex flex-col gap-10 animate__animated animate__fadeIn animate__faster`}>
            {/* Contextual Header inside Tab */}
            <div className="text-center px-4 pt-4">
              <p className="text-neongreen/60 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Discovery Mode</p>
              <h2 className="text-white text-3xl font-black tracking-tighter uppercase italic leading-none border-b border-neongreen/20 pb-6 inline-block w-full">為您推薦的絕佳選擇</h2>
            </div>

            <div className="space-y-6 px-2">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-1.5 h-1.5 bg-neongreen rounded-full shadow-[0_0_8px_#39FF14]"></div>
                  <label className="text-white font-black text-sm uppercase tracking-widest italic">熱門酒吧 (Popular Bars)</label>
                </div>
                <div className="relative group p-1">
                  <div className="absolute -inset-1 bg-gradient-to-r from-neongreen/20 to-transparent rounded-3xl blur opacity-25"></div>
                  <div className="relative bg-black/40 rounded-3xl p-4 border border-white/5 backdrop-blur-sm shadow-xl">
                    <BarPhotoCarousel
                      trip_plan_id={trip_plan_id}
                      newDetail={newDetail}
                      refreshAllDetails={refreshAllDetails}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-1.5 h-1.5 bg-neongreen rounded-full shadow-[0_0_8px_#39FF14]"></div>
                  <label className="text-white font-black text-sm uppercase tracking-widest italic">推薦電影 (Featured Movies)</label>
                </div>
                <div className="relative group p-1">
                  <div className="absolute -inset-1 bg-gradient-to-r from-neongreen/20 to-transparent rounded-3xl blur opacity-25"></div>
                  <div className="relative bg-black/40 rounded-3xl p-4 border border-white/5 backdrop-blur-sm shadow-xl">
                    <MoviePhotoCarousel
                      trip_plan_id={trip_plan_id}
                      newDetail={newDetail}
                      refreshAllDetails={refreshAllDetails}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer hint */}
            <div className="text-center py-8 pb-12 opacity-40">
              <p className="text-white text-[10px] uppercase tracking-[0.3em] font-bold">
                點擊推薦項目 即可快速加入您的專屬行程表
              </p>
              <div className="mt-4 flex justify-center gap-1 opacity-50">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-8 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
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
