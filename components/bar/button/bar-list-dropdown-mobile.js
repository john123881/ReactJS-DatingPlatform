import Search from '../input/search';
import { useRouter } from 'next/router';

export default function BarListDropdownMobile() {
  const router = useRouter();

  //bar-area 動態路由
  const handleAreaChange = (event) => {
    const areaId = event.target.value; // 這裡獲得的將是如 "1", "2", 等的字符串
    router.push(`/bar/bar-list/area/${areaId}`); // 使用 useRouter 來動態導航
  };

  //bar-type 動態路由
  const handleTypeChange = (event) => {
    const typeId = event.target.value; // 這裡獲得的將是如 "1", "2", 等的字符串
    router.push(`/bar/bar-list/${typeId}`); // 使用 useRouter 來動態導航
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
              onChange={handleAreaChange} // 為 select 元素添加 onChange 處理器
              defaultValue=""
            >
              <option disabled value="" className="text-black">
                酒吧區域
              </option>
              <option value="1" className="text-black">松山區</option>
              <option value="2" className="text-black">信義區</option>
              <option value="3" className="text-black">大安區</option>
              <option value="4" className="text-black">中山區</option>
              <option value="5" className="text-black">中正區</option>
              <option value="6" className="text-black">大同區</option>
              <option value="7" className="text-black">萬華區</option>
              <option value="8" className="text-black">文山區</option>
              <option value="9" className="text-black">南港區</option>
              <option value="10" className="text-black">內湖區</option>
              <option value="11" className="text-black">士林區</option>
              <option value="12" className="text-black">北投區</option>
            </select>
          </li>
          <li>
            <select
              className="select select-bordered rounded-xl border-white bg-transparent hover:border-[#A0FF1F] text-white"
              onChange={handleTypeChange} // 為 select 元素添加 onChange 處理器
              defaultValue=""
            >
              <option disabled value="" className="text-black">
                酒吧種類
              </option>
              <option value="1" className="text-black">運動酒吧</option>
              <option value="2" className="text-black">音樂酒吧</option>
              <option value="3" className="text-black">異國酒吧</option>
              <option value="4" className="text-black">特色酒吧</option>
              <option value="5" className="text-black">其他酒吧</option>
            </select>
          </li>
        </ul>
      </div>
    </>
  );
}
