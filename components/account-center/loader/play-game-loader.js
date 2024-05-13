import React from 'react';
import styles from './loader.module.css';

export default function PGLoader() {
  return (
    <>
      <div className="container flex justify-center  items-center w-[361.4px]  border-dark max-h-[53px] py-4">
        <div className="w-full text-center text-white basis-1/2 skeleton h-[30px]"></div>

        <div className="w-full text-center text-white basis-1/2 skeleton h-[30px]"></div>
      </div>
      {/* Body 遊戲區 */}
      <div className="container relative w-full min-h-[527px] skeleton">
        <div className="w-full skeleton h-[332.1px] relative ">
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
        </div>
      </div>
    </>
  );
}
