import { useRouter } from 'next/router';

export default function BarListSidebar() {
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
    <div>
      {/* 酒吧種類及酒吧地區的select選單，使用basis-2/12給定固定的寬度 */}
      <div className="flex flex-col gap-4 lg:basis-2/12">
        <select
          className="select select-bordered select-sm w-[139px] rounded-xl border-white hover:border-[#A0FF1F]"
          onChange={handleAreaChange} // 為 select 元素添加 onChange 處理器
          defaultValue=""
        >
          <option disabled value="">
            酒吧區域
          </option>
          <option value="1">松山區</option>
          <option value="2">信義區</option>
          <option value="3">大安區</option>
          <option value="4">中山區</option>
          <option value="5">中正區</option>
          <option value="6">大同區</option>
          <option value="7">萬華區</option>
          <option value="8">文山區</option>
          {/* <option value="9">南港區</option> */}
          <option value="10">內湖區</option>
          <option value="11">士林區</option>
          <option value="12">北投區</option>
        </select>
        <select
          className="select select-bordered select-sm w-[139px] rounded-xl border-white  hover:border-[#A0FF1F]"
          onChange={handleTypeChange} // 為 select 元素添加 onChange 處理器
          defaultValue=""
        >
          <option disabled value="">
            酒吧種類
          </option>
          <option value="1">運動酒吧</option>
          <option value="2">音樂酒吧</option>
          <option value="3">異國酒吧</option>
          <option value="4">特色酒吧</option>
          <option value="5">其他酒吧</option>
        </select>
      </div>
    </div>
  );
}
