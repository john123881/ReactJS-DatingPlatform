/**
 * RecordFilterBar - 紀錄頁面的篩選工具列
 */
export default function RecordFilterBar({ 
  source, 
  onSourceChange, 
  dateBegin, 
  onDateBeginChange, 
  dateEnd, 
  onDateEndChange,
  showSource = true,
  currentDate
}) {
  return (
    <div className="flex justify-between mt-4 item-center">
      {showSource && (
        <select
          value={source}
          onChange={onSourceChange}
          className="w-full max-w-[150px] min-w-[90px] sm:ms-2 border-slate-700 px-4 select justify-start select-bordered select-sm join-item"
        >
          <option value="全部">全部</option>
          <option value="登入獲得">登入獲得</option>
          <option value="遊玩遊戲">遊玩遊戲</option>
        </select>
      )}
      <div className="flex justify-end ms-auto">
        <label className="flex items-center border-slate-700 w-full min-w-[120px] max-w-[150px] gap-1 ms-2 px-0 pe-1 sm:px-2 input input-bordered input-sm">
          <input
            type="date"
            className="px-0 text-center cursor-pointer grow input-sm bg-transparent border-none"
            value={dateBegin}
            max={dateEnd || currentDate}
            onChange={onDateBeginChange}
          />
        </label>
        <span className="items-center pt-1 mx-1 text-slate-400">~</span>
        <label className="flex items-center border-slate-700 w-full min-w-[120px] max-w-[150px] gap-1 px-0 pe-1 sm:px-2 input input-bordered input-sm">
          <input
            type="date"
            className="px-0 text-center cursor-pointer grow input-sm bg-transparent border-none"
            value={dateEnd}
            min={dateBegin}
            max={currentDate}
            onChange={onDateEndChange}
          />
        </label>
      </div>
    </div>
  );
}
