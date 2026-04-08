import { useEffect, useState } from 'react';
import { BarService } from '@/services/bar-service';
import { useRouter } from 'next/router';

export default function BarListSidebar({ onAreaSelected, onTypeSelected }) {
  const router = useRouter();
  const [areas, setAreas] = useState([]);
  const [types, setTypes] = useState([]);

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
        console.error('Error loading sidebar data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAreaChange = (areaId) => {
    if (onAreaSelected) {
      onAreaSelected(areaId);
      return;
    }
    
    const newQuery = { ...router.query };
    if (areaId) newQuery.bar_area_id = areaId;
    else delete newQuery.bar_area_id;
    
    router.push({
      pathname: '/bar/bar-list',
      query: newQuery,
    });
  };

  const handleTypeChange = (typeId) => {
    if (onTypeSelected) {
      onTypeSelected(typeId);
      return;
    }

    const newQuery = { ...router.query };
    if (typeId) newQuery.bar_type_id = typeId;
    else delete newQuery.bar_type_id;

    router.push({
      pathname: '/bar/bar-list',
      query: newQuery,
    });
  };

  return (
    <div className="flex flex-col gap-8 p-6 glass-sidebar rounded-[2rem] border border-white/10 shadow-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-[#A0FF1F] rounded-full shadow-[0_0_8px_#A0FF1F]"></div>
          <label className="text-white font-bold text-sm tracking-[0.2em] uppercase">
            地區探索
          </label>
        </div>
        <select
          className="select select-bordered w-full rounded-2xl border-white/10 bg-white/5 hover:border-[#A0FF1F] text-white focus:outline-none focus:ring-1 focus:ring-[#A0FF1F] transition-all duration-300 cursor-pointer h-[45px] backdrop-blur-xl"
          onChange={(e) => handleAreaChange(e.target.value)}
          value={router.query.bar_area_id || ''}
        >
          <option value="" className="text-black bg-white">
            台北全區
          </option>
          {areas.map((area) => (
            <option key={area.bar_area_id} value={area.bar_area_id} className="text-black bg-white">
              {area.bar_area_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-[#A0FF1F] rounded-full shadow-[0_0_8px_#A0FF1F]"></div>
          <label className="text-white font-bold text-sm tracking-[0.2em] uppercase">
            酒吧類型
          </label>
        </div>
        <select
          className="select select-bordered w-full rounded-2xl border-white/10 bg-white/5 hover:border-[#A0FF1F] text-white focus:outline-none focus:ring-1 focus:ring-[#A0FF1F] transition-all duration-300 cursor-pointer h-[45px] backdrop-blur-xl"
          onChange={(e) => handleTypeChange(e.target.value)}
          value={router.query.bar_type_id || ''}
        >
          <option value="" className="text-black bg-white">
            不限種類
          </option>
          {types.map((type) => (
            <option key={type.bar_type_id} value={type.bar_type_id} className="text-black bg-white">
              {type.bar_type_name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-12 p-4 rounded-2xl bg-[#A0FF1F]/5 border border-[#A0FF1F]/10">
        <p className="text-[11px] text-[#A0FF1F]/80 text-center font-medium leading-relaxed">
          讓霓虹指引您的<br/>今晚行程
        </p>
      </div>
    </div>
  );
}
