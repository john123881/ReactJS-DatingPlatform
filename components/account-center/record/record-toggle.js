import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

/**
 * RecordToggle - 積分/遊戲紀錄切換開關
 */
export default function RecordToggle({ checked, onChange, onReset }) {
  return (
    <label
      onClick={onReset}
      className="relative grid px-4 mx-auto mt-4 border rounded-full cursor-pointer border-slate-700 bg-base-300 border-rounded place-items-center"
    >
      <span
        className={` absolute left-[16px] h-[22px] w-[130px] rounded-full  bg-primary z-10 ${
          checked
            ? 'translate-x-[100%] duration-700 ease-in-out'
            : ' duration-700 ease-in-out'
        }`}
      ></span>
      <span
        className={`${
          checked ? 'text-light' : 'text-dark'
        } select-none delay-400 z-20 col-start-1 row-start-1 relative max-w-[145px] min-w-[130px] px-3 py-1 my-1 rounded-full text-center label-text `}
      >
        積分查詢
      </span>

      <input
        type="checkbox"
        id="toggle"
        checked={checked}
        onChange={onChange}
        className="hidden col-span-2 col-start-1 row-start-1 toggle bg-base-content"
      />
      <span
        className={`${
          checked ? 'text-dark' : 'text-light'
        } select-none delay-400 z-20 col-start-2 row-start-1 max-w-[145px] min-w-[130px] px-3 py-1 my-1 rounded-full text-center label-text`}
      >
        遊戲紀錄
      </span>
    </label>
  );
}
