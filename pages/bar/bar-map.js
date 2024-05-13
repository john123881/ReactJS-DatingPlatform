import BarListSidebar from '@/components/bar/bar/bar-list-sidebar(1)';
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function barMap({ onPageChange }) {
  const router = useRouter();

  useEffect(() => {
    router.back();
  }, []);

  // const pageTitle = '社群媒體';
  // const router = useRouter();
  // useEffect(() => {
  //   onPageChange(pageTitle);
  //   if (!router.isReady) return;
  // }, [router.query]);

  //   return (
  //     <>
  //       <PageTitle pageTitle={pageTitle} />
  //       <div className="flex flex-row pt-28 justify-center">
  //         {/* 左側空白欄 */}
  //         <div className="w-1/12 md:w-3/12">
  //           <div className="">
  //             <div className=""></div>
  //           </div>
  //         </div>
  //         {/* 中間主要內容 */}
  //         <div className="w-10/12 md:w-6/12">2</div>
  //       </div>
  //     </>
  //   );
}
