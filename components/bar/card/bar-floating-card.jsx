import React from 'react';
import Link from 'next/link';
import { toast } from '@/lib/toast';

const BarFloatingCard = ({ bar, onClose }) => {
  if (!bar) return null;

  // 強化版圖片邏輯：支援所有可能的後端欄位
  const barPic = bar.bar_img_url 
    ? bar.bar_img_url 
    : bar.bar_pic_name 
    ? `/barPic/${bar.bar_pic_name}` 
    : bar.bar_img
    ? `${process.env.NEXT_PUBLIC_API_URL}/img/bar/${bar.bar_img}`
    : '/unavailable-image.jpg';

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:top-24 md:right-6 md:translate-x-0 w-[92%] max-w-[400px] bg-[#0A0A0A]/85 backdrop-blur-xl border border-[#A0FF1F]/40 rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(160,255,31,0.1)] z-50 animate-in fade-in transition-all duration-500">
      <div className="relative h-48">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-[#A0FF1F] hover:text-black transition-all z-20 border border-white/10"
        >
          <span className="text-lg">✕</span>
        </button>
        
        {/* 圖片遮罩 (漸層) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
        
        <img
          src={barPic}
          alt={bar.bar_name}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 w-full p-5 z-20">
          <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
            {bar.bar_name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#A0FF1F] flex items-center">
              <span className="text-xl">★</span>
              <span className="font-bold ml-1">{bar.rating || '5.0'}</span>
            </span>
            <span className="text-white/40 text-xs font-medium">|</span>
            <p className="text-sm text-white/70 truncate font-medium">
              {bar.bar_addr || bar.bar_address || '台北精選約會地點'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {bar.bar_area_name && (
            <span className="px-3 py-1 bg-white/5 text-white/80 text-[11px] font-bold rounded-full border border-white/10 uppercase tracking-wider">
              {bar.bar_area_name}
            </span>
          )}
          <span className="px-3 py-1 bg-[#A0FF1F]/10 text-[#A0FF1F] text-[11px] font-bold rounded-full border border-[#A0FF1F]/20 uppercase tracking-wider">
            {bar.bar_type_name || '精選酒吧'}
          </span>
        </div>

        <div className="flex gap-3">
          <Link
            href="/under-construction"
            className="flex-[1.5] py-3.5 bg-[#A0FF1F] text-black text-sm font-black rounded-xl text-center shadow-[0_0_20px_rgba(160,255,31,0.4)] hover:shadow-[0_0_35px_rgba(160,255,31,0.6)] hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-tighter"
          >
            立即訂位
          </Link>
          <Link
            href={`/bar/bar-detail/${bar.id || bar.bar_id}`}
            className="flex-1 py-3.5 bg-white/5 text-white text-sm font-bold rounded-xl text-center border border-white/10 hover:bg-white/10 transition-all active:scale-95 uppercase tracking-tighter"
          >
            詳情
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BarFloatingCard);
