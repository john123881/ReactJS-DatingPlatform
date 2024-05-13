import React from 'react';
import { BsList } from 'react-icons/bs';

export default function BurgerMenu({ currentPage }) {
  return (
    <>
      <div className="flex border-b border-solid item-center menu-title ps-0">
        <div className="flex items-center drawer-content sm:hidden">
          <label htmlFor="my-drawer-2" className="drawer-button lg:hidden">
            <BsList className="text-2xl" />
          </label>
        </div>
        <div className="flex flex-row items-end">
          <div className="text-2xl text-light ms-3 min-w-[100px]">
            {currentPage}
          </div>
          <span
            className={`${
              currentPage === '更改密碼' ? '' : 'hidden'
            } text-[10px] max-h-[32px] sm:text-[12px] text-red-500 font-thin ml-2`}
          >
            輸入8-16 個字元，需包含大小寫英文、數字及特殊符號。
          </span>
        </div>
      </div>
    </>
  );
}
