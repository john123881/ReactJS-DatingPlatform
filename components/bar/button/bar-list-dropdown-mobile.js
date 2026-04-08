import { useState, useEffect } from 'react';
import Search from '../input/search';
import { useRouter } from 'next/router';
import { BarService } from '@/services/bar-service';

export default function BarListDropdownMobile() {
  const router = useRouter();
  const [areas, setAreas] = useState([]);
  const [types, setTypes] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areaData, typeData] = await Promise.all([
          BarService.getBarAreas(),
          BarService.getBarTypes(),
        ]);
        setAreas(areaData);
        setTypes(typeData);
      } catch (error) {
        console.error('Error loading mobile dropdown data:', error);
      }
    };
    fetchData();
  }, []);

  // Sync state with router when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleAreaChange = (event) => {
    const areaId = event.target.value;
    const newQuery = { ...router.query };
    if (areaId) newQuery.bar_area_id = areaId;
    else delete newQuery.bar_area_id;

    router.push({ pathname: '/bar/bar-list', query: newQuery }, undefined, { shallow: true });
  };

  const handleTypeChange = (event) => {
    const typeId = event.target.value;
    const newQuery = { ...router.query };
    if (typeId) newQuery.bar_type_id = typeId;
    else delete newQuery.bar_type_id;

    router.push({ pathname: '/bar/bar-list', query: newQuery }, undefined, { shallow: true });
  };

  const resetFilters = () => {
    router.push({ pathname: '/bar/bar-list', query: {} }, undefined, { shallow: true });
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* 觸發按鈕 */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#A0FF1F]/30 bg-white/5 text-white hover:bg-[#A0FF1F]/10 transition-all duration-300 shadow-[0_0_10px_rgba(160,255,31,0.05)] active:scale-95 whitespace-nowrap"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#A0FF1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span className="text-[12px] font-bold tracking-tight">篩選</span>
      </button>

      {/* 底部抽屜 Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-end justify-center transition-all animate-fadeIn"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={() => setIsOpen(false)}
        >
          {/* 抽屜內容 */}
          <div 
            className="w-full bg-[#0F0F0F] rounded-t-[2.5rem] p-8 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 提手 */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8"></div>

            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-bold text-white neon-text-green text-center">探索驚喜酒吧</h2>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-3 bg-[#A0FF1F] rounded-full"></div>
                    <label className="text-white/60 text-xs font-bold tracking-widest uppercase">選擇地區</label>
                  </div>
                  <select
                    className="select select-bordered w-full rounded-2xl bg-white/5 border-white/10 text-white focus:outline-none focus:border-[#A0FF1F] h-[50px]"
                    onChange={handleAreaChange}
                    value={router.query.bar_area_id || ''}
                  >
                    <option value="">台北全區</option>
                    {areas.map((area) => (
                      <option key={area.bar_area_id} value={area.bar_area_id} className="text-black">{area.bar_area_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-3 bg-[#A0FF1F] rounded-full"></div>
                    <label className="text-white/60 text-xs font-bold tracking-widest uppercase">酒吧種類</label>
                  </div>
                  <select
                    className="select select-bordered w-full rounded-2xl bg-white/5 border-white/10 text-white focus:outline-none focus:border-[#A0FF1F] h-[50px]"
                    onChange={handleTypeChange}
                    value={router.query.bar_type_id || ''}
                  >
                    <option value="">不限種類</option>
                    {types.map((type) => (
                      <option key={type.bar_type_id} value={type.bar_type_id} className="text-black">{type.bar_type_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button 
                  onClick={resetFilters}
                  className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all"
                >
                  清除全部
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-4 rounded-2xl bg-[#A0FF1F] text-black font-bold shadow-[0_0_20px_rgba(160,255,31,0.4)] active:scale-95 transition-all"
                >
                  套用篩選
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
