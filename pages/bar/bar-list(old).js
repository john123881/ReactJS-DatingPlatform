import { useEffect, useState } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar(1)';
import BarListDropdownMobile from '@/components/bar/button/bar-list-dropdown-mobile';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function BarList({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const currentPage = '酒吧列表';

  const [bars, setBars] = useState([]);

  const getBarList = async () => {
    try {
      const res = await fetch('http://localhost:3001/bar/bar-list');
      const data = await res.json();
      // console.log(data);
      setBars(data);
    } catch (error) {
      console.log('Failed to fetch bar list:', error);
    }
  };

  useEffect(() => {
    getBarList();
    // console.log('useEffect log -> bars:', bars);
  }, []);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="">
        {/* <div className="fixed z-40 justify-center w-full h-8 mx-auto top-16 bg-dark">
          <TabBar tabs={initialTabs} />
        </div> */}

        <div className="flex flex-row justify-center pt-28">
          {/* 右留 2/12 空白 */}
          <div className="flex-col items-center hidden md:flex md:w-2/12">
            <BarListSidebar />
          </div>

          {/* 「特色酒吧」標題、搜尋欄及BarCard元件，使用basis-6/12給定固定的寬度 */}
          <div className="flex flex-col justify-center w-11/12 gap-4 mx-auto md:w-8/12">
            <div className="text-sm breadcrumbs">
              <Breadcrumbs currentPage={currentPage} />
            </div>
            {/* 「特色酒吧」標題和搜尋欄 */}
            <div className="flex items-center justify-between">
              <div className="font-bold text-white md:text-h5">特色酒吧</div>
              <BarListDropdownMobile />
              <label className="hidden input input-bordered md:flex items-center gap-2 h-[32px] rounded-xl border-white bg-transparent hover:border-[#A0FF1F] text-white">
                <input type="text" className="grow" placeholder="搜索" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
            {/* BarCard元件展示 */}
            <div className="flex flex-wrap items-center justify-center w-full gap-4 mx-auto">
              {bars.slice(0, 8).map((bar, i) => (
                <BarCard bar={bar} key={i} />
              ))}
              {/* <BarCard />
              <BarCard />
              <BarCard />
              <BarCard />
              <BarCard />
              <BarCard />
              <BarCard /> */}
            </div>
          </div>

          {/* 左留 2/12 空白 */}
          <div className="flex md:w-2/12"></div>
        </div>
      </div>
    </>
  );
}
