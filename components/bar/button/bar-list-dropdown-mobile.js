import { useState, useEffect } from 'react';
import Search from '../input/search';
import { useRouter } from 'next/router';
import { BarService } from '@/services/bar-service';

export default function BarListDropdownMobile() {
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
        console.error('Error loading mobile dropdown data:', error);
      }
    };
    fetchData();
  }, []);

  //bar-area 動態路由 - 優化為組合過濾
  const handleAreaChange = (event) => {
    const areaId = event.target.value;
    const newQuery = { ...router.query };
    
    if (areaId) {
      newQuery.bar_area_id = areaId;
    } else {
      delete newQuery.bar_area_id;
    }

    router.push({
      pathname: '/bar/bar-list',
      query: newQuery,
    }, undefined, { shallow: true });
  };

  //bar-type 動態路由 - 優化為組合過濾
  const handleTypeChange = (event) => {
    const typeId = event.target.value;
    const newQuery = { ...router.query };

    if (typeId) {
      newQuery.bar_type_id = typeId;
    } else {
      delete newQuery.bar_type_id;
    }

    router.push({
      pathname: '/bar/bar-list',
      query: newQuery,
    }, undefined, { shallow: true });
  };

  return (
    <>
      <div className="dropdown dropdown-end md:hidden">
        <div tabIndex={0} role="button" className="btn m-1">
          進階搜尋
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu bg-base-100 p-2 w-[290px] gap-4 rounded-xl"
        >
          <li>
            <Search />
          </li>
          <li>
            <select
              className="select select-bordered rounded-xl border-white bg-transparent hover:border-[#A0FF1F] text-white"
              onChange={handleAreaChange} 
              defaultValue=""
            >
              <option disabled value="" className="text-black">
                酒吧區域
              </option>
              {areas.map((area) => (
                <option key={area.bar_area_id} value={area.bar_area_id} className="text-black">
                  {area.bar_area_name}
                </option>
              ))}
            </select>
          </li>
          <li>
            <select
              className="select select-bordered rounded-xl border-white bg-transparent hover:border-[#A0FF1F] text-white"
              onChange={handleTypeChange} 
              defaultValue=""
            >
              <option disabled value="" className="text-black">
                酒吧種類
              </option>
              {types.map((type) => (
                <option key={type.bar_type_id} value={type.bar_type_id} className="text-black">
                  {type.bar_type_name}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </div>
    </>
  );
}
