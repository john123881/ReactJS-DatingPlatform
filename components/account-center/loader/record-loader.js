import React from 'react';
import styles from './loader.module.css';

export default function RecordLoader() {
  return (
    <>
      {/* <div className="container flex justify-center items-center w-[361.4px]  border-dark max-h-[53px] py-4">
        <div className="w-full text-center text-white basis-1/2 skeleton h-[30px]"></div>

        <div className="w-full text-center text-white basis-1/2 skeleton h-[30px]"></div>
      </div> */}
      {/* Toggle */}
      <label className="relative grid px-4 mx-auto mt-4 w-[292px] h-[38px] skeleton border rounded-full cursor-pointer border-slate-700 bg-base-300 border-rounded place-items-center"></label>
      {/* SearchBar START */}
      <div className="flex justify-between mt-4 item-center">
        <div className="flex justify-end ms-auto">
          <label className="flex items-center rounded-[8px] border-slate-700 skeleton w-full min-w-[120px] max-w-[150px] gap-1 ms-2  ps-2 pe-1 sm:px-2 input input-bordered input-sm"></label>
          <span className="items-center pt-1 mx-1">~</span>
          <label className="flex items-center rounded-[8px] border-slate-700 skeleton w-full min-w-[120px] max-w-[150px] gap-1 px-0 pe-1 sm:px-2 input input-bordered input-sm"></label>
        </div>
      </div>

      {/* CONTENT1 START */}
      <div
        className={`mt-4 relative flex flex-col justify-between w-full skeleton h-[580px] lg:mx-1 xl:mx-1 bg-base-300 rounded-box place-items-center`}
      >
        {/* 愛心。loader */}
        <div className="absolute z-50 top-[-250px] flex justify-center w-full md:basis-6/12">
          <div
            className="flex items-center justify-center w-full"
            style={{ minHeight: '100vh' }}
          >
            <div className={`${styles[`lds-heart`]}`}>
              <div></div>
            </div>
          </div>
        </div>
        <table className="container table py-4 ">
          <thead className="w-full min-h-[52px]">
            <tr className="border-b border-slate-500 min-h-[52px]">
              <th className="text-lg text-center text-light h-[52px] py-[16px]"></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div className="mb-3 join "></div>
      </div>
      {/* CONTENT1 END */}
    </>
  );
}
