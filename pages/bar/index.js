import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TabBar from '@/components/bar/bar/tab-bar';
// import Search from '@/components/bar/input/search';
import BarTypeCardsMobile from '@/components/bar/card/bar-type-cards-mobile';
import BarTypeCards from '@/components/bar/card/bar-type-cards-up';
import BarTypeCards2 from '@/components/bar/card/bar-type-cards-down';
import BarCardIndex from '@/components/bar/card/bar-card-index';
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from 'react-icons/md';
import PageTitle from '@/components/page-title';

export default function Index({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const [randomBars, setRandomBars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [barRender, setBarRender] = useState(false);
  const displayCount = 3; // Number of bars to display at once

  // random bar
  const getBarListRandom = async () => {
    try {
      const res = await fetch('http://localhost:3001/bar/bar-list-random');
      const data = await res.json();
      // console.log(data);
      setRandomBars(data);
    } catch (error) {
      console.log('Failed to fetch bar random:', error);
    }
  };

  // next 3 random
  useEffect(() => {
    getBarListRandom();
  }, [barRender]);

  // 按一下在生成隨機三筆
  const prevBars = () => {
    setCurrentIndex(
      (prev) => (prev - displayCount + randomBars.length) % randomBars.length
    );
    setBarRender(!barRender);
  };

  // Calculate the bars to be displayed based on the current index
  const displayedBars = randomBars
    .slice(currentIndex, currentIndex + displayCount)
    .concat(
      randomBars.slice(
        0,
        Math.max(displayCount - (randomBars.length - currentIndex), 0)
      )
    );

  const initialTabs = [
    { title: '酒吧地圖', path: '/bar/bar-map', active: false },
    { title: '酒吧首頁', path: '/bar', active: true },
    { title: '訂位紀錄', path: '/bar/bar-booking-list', active: false },
  ];
  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="fixed z-40 justify-center w-full h-8 mx-auto top-16 bg-dark">
        <TabBar tabs={initialTabs} />
      </div>
      <div className="container flex items-center justify-center w-full pt-24 mx-auto bar md:w-8/12">
        <div className="flex flex-col bar-index-content">
          <div className="mt-4 search-zone md:mt-12">
            <div className="flex items-center justify-center font-bold text-center text-white text-h5 md:text-h1">
              今晚想去哪約會？
              <div className="hidden md:m-5 md:flex md:justify-center">
                {/* <Search /> */}
                <Link href={`/bar/bar-list/`}>
                  <button className="btn btn-outline rounded-xl border-white bg-transparent hover:bg-[#A0FF1F] text-white">
                    探索全部
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-10 bar-cards">
            <div className="bar-type-card-mobile flex flex-col justify-center items-center mx-auto w-[340px] md:hidden">
              <BarTypeCardsMobile />
            </div>
            <div className="hidden md:flex md:justify-center md:items-center">
              <BarTypeCards />
              {/* <BarTypeCards />
              <BarTypeCards /> */}
            </div>
            <div className="hidden md:flex md:justify-center md:items-center">
              <BarTypeCards2 />
              {/* <BarTypeCards2 /> */}
            </div>
          </div>

          <div className="text-[18px] md:text-[28px] text-white font-bold text-center mb-4">
            熱門酒吧
          </div>
          <div className="hidden player-wall md:flex md:justify-center md:items-center">
            <div className="flex items-center justify-center gap-16">
              <button onClick={prevBars}>
                <MdOutlineArrowBackIos className="text-[#A0FF1F] text-[30px]" />
              </button>
              {displayedBars.map((randomBar, i) => (
                <BarCardIndex key={i} randomBar={randomBar} />
              ))}
              <button onClick={prevBars}>
                <MdOutlineArrowForwardIos className="text-[#A0FF1F] text-[30px]" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center w-100 md:hidden">
            <div className="gap-5 carousel rounded-box">
              <div className="gap-5 carousel-item">
                {randomBars.slice(0, 2).map((randomBar, i) => (
                  <BarCardIndex key={i} randomBar={randomBar} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
