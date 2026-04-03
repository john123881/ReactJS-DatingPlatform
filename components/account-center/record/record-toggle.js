/**
 * RecordToggle - 積分/遊戲紀錄切換開關
 */
export default function RecordToggle({ checked, onChange }) {
  return (
    <label
      className="relative grid grid-cols-2 px-4 mx-auto mt-4 border rounded-full cursor-pointer border-slate-700 bg-base-300 border-rounded place-items-center w-[300px] h-[40px]"
    >
      <span
        className={` absolute left-[4px] h-[32px] w-[142px] rounded-full bg-primary z-10 transition-transform duration-500 ease-in-out ${
          checked ? 'translate-x-[150px]' : 'translate-x-0'
        }`}
      ></span>
      <span
        className={`${
          checked ? 'text-white' : 'text-black'
        } select-none z-20 col-start-1 row-start-1 relative w-full py-1 rounded-full text-center label-text `}
      >
        積分查詢
      </span>

      <input
        type="checkbox"
        id="toggle"
        checked={checked}
        onChange={onChange}
        className="absolute opacity-0 w-full h-full cursor-pointer z-30"
      />
      <span
        className={`${
          checked ? 'text-black' : 'text-white'
        } select-none z-20 col-start-2 row-start-1 w-full py-1 rounded-full text-center label-text`}
      >
        遊戲紀錄
      </span>
    </label>
  );
}
