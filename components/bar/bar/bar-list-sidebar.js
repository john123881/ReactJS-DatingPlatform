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
    <div className="lg:basis-2/12 flex flex-col gap-4">
      <select
        className="select select-bordered select-sm w-[139px] rounded-xl border-white bg-transparent hover:border-[#A0FF1F] text-white"
        onChange={(e) => handleAreaChange(e.target.value)}
        value={router.query.bar_area_id || ''}
      >
        <option value="" className="text-black">
          所有區域
        </option>
        {areas.map((area) => (
          <option key={area.bar_area_id} value={area.bar_area_id} className="text-black">
            {area.bar_area_name}
          </option>
        ))}
      </select>
      <select
        className="select select-bordered select-sm w-[139px] rounded-xl border-white bg-transparent hover:border-[#A0FF1F] text-white"
        onChange={(e) => handleTypeChange(e.target.value)}
        value={router.query.bar_type_id || ''}
      >
        <option value="" className="text-black">
          所有種類
        </option>
        {types.map((type) => (
          <option key={type.bar_type_id} value={type.bar_type_id} className="text-black">
            {type.bar_type_name}
          </option>
        ))}
      </select>
    </div>
  );
}
