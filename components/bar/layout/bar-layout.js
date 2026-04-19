import React from 'react';
import TabBar from '../bar/tab-bar';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function BarLayout({ children, title }) {
  const router = useRouter();
  const currentPath = router.asPath;

  // 動態定義分頁標籤，並根據目前路徑自動判斷 active 狀態
  const tabs = [
    { 
      title: '酒吧地圖', 
      path: '/bar/bar-map', 
      active: currentPath.startsWith('/bar/bar-map') 
    },
    { 
      title: '酒吧', 
      path: '/bar', 
      active: currentPath === '/bar' || currentPath.includes('/bar/bar-list') || currentPath.includes('/bar/bar-detail') || currentPath.includes('/bar/bar-rating-list')
    },
    { 
      title: '訂位紀錄', 
      path: '/under-construction', 
      active: router.asPath === '/under-construction', 
      isProtected: true 
    },
  ];

  return (
    <>
      <PageTitle pageTitle={title || '酒吧探索'} />
      
      {/* 統一的頂部 TabBar 區域 */}
      <div className="fixed z-40 justify-center w-full h-8 mx-auto top-16 bg-dark">
        <TabBar tabs={tabs} />
      </div>

      <div className="relative">
        {children}
      </div>
    </>
  );
}
