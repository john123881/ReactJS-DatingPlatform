import React from 'react';
import Link from 'next/link';
import BarTypeCardsMobile from '@/components/bar/card/bar-type-cards-mobile';
import BarTypeCards from '@/components/bar/card/bar-type-cards-up';
import BarTypeCards2 from '@/components/bar/card/bar-type-cards-down';

/**
 * 酒吧首頁 Hero 區塊 (包含標題與五大分類)
 */
export default function BarIndexHero() {
  return (
    <div className="flex flex-col bar-index-content">
      {/* 標題與搜尋入口 */}
      <div className="mt-4 search-zone md:mt-12">
        <div className="flex items-center justify-center font-bold text-center text-white text-h5 md:text-h1">
          今晚想去哪約會？
          <div className="hidden md:m-5 md:flex md:justify-center">
            <Link href={`/bar/bar-list/`}>
              <button className="btn btn-outline rounded-xl border-white bg-transparent hover:bg-[#A0FF1F] text-white">
                探索全部
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 五大分區卡片 */}
      <div className="mb-10 bar-cards">
        <div className="bar-type-card-mobile flex flex-col justify-center items-center mx-auto w-[340px] md:hidden">
          <BarTypeCardsMobile />
        </div>
        <div className="hidden md:flex md:justify-center md:items-center">
          <BarTypeCards />
        </div>
        <div className="hidden md:flex md:justify-center md:items-center">
          <BarTypeCards2 />
        </div>
      </div>
    </div>
  );
}
