import React from 'react';
import styles from './loader.module.css';

export default function NewFriendModuleLoader() {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 gap-6">
        <div className="absolute z-50 flex justify-center w-full md:basis-6/12">
          <div
            className="flex items-center justify-center w-full"
            style={{ minHeight: '60vh' }}
          >
            <div className={`${styles[`lds-heart`]}`}>
              <div></div>
            </div>
          </div>
        </div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-64 w-64"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="flex gap-4 items-center">
          <div className="skeleton h-4 w-28"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-28"></div>
          </div>
        </div>
      </div>
    </>
  );
}
