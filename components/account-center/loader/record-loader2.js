import React from 'react';
import styles from './loader.module.css';

export default function RecordLoader2() {
  return (
    <>
      <tr className=" text-slate-400 bg-base-300 hover:text-primary">
        <td className="text-base text-center ">2024/04/14</td>
        <td className="text-base text-center ">10</td>
        <td className="text-base text-center ">登入獲得</td>
      </tr>
      <tr className="absolute h-[489px] bg-base-300 top-[0px] z-40 flex justify-center w-full  md:basis-6/12">
        <td className="flex items-center justify-center w-full">
          <div className={`${styles[`lds-heart`]}`}>
            <div></div>
          </div>
        </td>
      </tr>
    </>
  );
}
