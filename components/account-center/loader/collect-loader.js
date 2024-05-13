import React from 'react';
import styles from './loader.module.css';

export default function CollectLoader() {
  return (
    <>
      <div
        className={`mt-4 pb-3  flex flex-col relative justify-between w-full lg:mx-1 xl:mx-1 rounded-box  place-items-center `}
      >
        <div
          style={{ '--tw-bg-opacity': 0 }}
          className="min-h-[1080px] absolute bg-dark top-[300px] z-50  flex justify-center w-full  md:basis-6/12"
        >
          <div className="flex items-start justify-center w-full ">
            <div className={`${styles[`lds-heart`]}`}>
              <div></div>
            </div>
          </div>
        </div>

        <div className="grid outline outline-1  z-10 rounded-xl my-2 w-[360px] sm:w-full outline-grayBorder grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px]">
          <div className="shadow-xl card sm:card-side ">
            <figure className=" sm:w-[300px] h-[200px]  sm:basis-1/3  skeleton "></figure>
            <div className="card-body  h-[200px] relative  bg-dark pe-[48px] sm:basis-2/3">
              <p className="skeleton bg-dark max-h-[24px] max-w-[150px]"></p>
              <p className="skeleton bg-dark "></p>
              <div className="absolute bottom-[16px] right-[16px] justify-end card-actions "></div>
            </div>
          </div>
        </div>
        <div className="grid outline outline-1  z-10 rounded-xl my-2 w-[360px] sm:w-full outline-grayBorder grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px]">
          <div className="shadow-xl card sm:card-side ">
            <figure className=" sm:w-[300px] h-[200px]  sm:basis-1/3  skeleton "></figure>
            <div className="card-body  h-[200px] relative  bg-dark pe-[48px] sm:basis-2/3">
              <p className="skeleton bg-dark max-h-[24px] max-w-[150px]"></p>
              <p className="skeleton bg-dark "></p>
              <div className="absolute bottom-[16px] right-[16px] justify-end card-actions "></div>
            </div>
          </div>
        </div>
        <div className="grid outline outline-1  z-10 rounded-xl my-2 w-[360px] sm:w-full outline-grayBorder grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px]">
          <div className="shadow-xl card sm:card-side ">
            <figure className=" sm:w-[300px] h-[200px]  sm:basis-1/3  skeleton "></figure>
            <div className="card-body  h-[200px] relative  bg-dark pe-[48px] sm:basis-2/3">
              <p className="skeleton bg-dark max-h-[24px] max-w-[150px]"></p>
              <p className="skeleton bg-dark "></p>
              <div className="absolute bottom-[16px] right-[16px] justify-end card-actions "></div>
            </div>
          </div>
        </div>
        <div className="grid outline outline-1  z-10 rounded-xl my-2 w-[360px] sm:w-full outline-grayBorder grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px]">
          <div className="shadow-xl card sm:card-side ">
            <figure className=" sm:w-[300px] h-[200px]  sm:basis-1/3  skeleton "></figure>
            <div className="card-body  h-[200px] relative  bg-dark pe-[48px] sm:basis-2/3">
              <p className="skeleton bg-dark max-h-[24px] max-w-[150px]"></p>
              <p className="skeleton bg-dark "></p>
              <div className="absolute bottom-[16px] right-[16px] justify-end card-actions "></div>
            </div>
          </div>
        </div>
        <div className="grid outline outline-1  z-10 rounded-xl my-2 w-[360px] sm:w-full outline-grayBorder grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px]">
          <div className="shadow-xl card sm:card-side ">
            <figure className=" sm:w-[300px] h-[200px]  sm:basis-1/3  skeleton "></figure>
            <div className="card-body  h-[200px] relative  bg-dark pe-[48px] sm:basis-2/3">
              <p className="skeleton bg-dark max-h-[24px] max-w-[150px]"></p>
              <p className="skeleton bg-dark "></p>
              <div className="absolute bottom-[16px] right-[16px] justify-end card-actions "></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
