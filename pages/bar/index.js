import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { BarService } from '@/services/bar-service';
import Loader from '@/components/ui/loader/loader';

import { useAuth } from '@/context/auth-context';

export default function Index({ onPageChange }) {
  const { auth, setLoginModalToggle } = useAuth();
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const [randomBars, setRandomBars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [barRender, setBarRender] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedBars, setSavedBars] = useState({});
  const displayCount = 3; // Number of bars to display at once

  // random bar
  const getBarListRandom = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await BarService.getRandomBars();
      setRandomBars(Array.isArray(result) ? result : (result.data || []));
    } catch (error) {
      console.error('Failed to fetch bar random:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 檢查儲存狀態
  const checkBarsStatus = useCallback(
    async (barIds) => {
      const userId = auth.id;
      if (userId === 0 || !barIds) return;

      try {
        const data = await BarService.checkBarStatus(userId, barIds);
        setSavedBars((prevSavedBars) => {
          const newSavedBars = { ...prevSavedBars };
          data.forEach((status) => {
            newSavedBars[status.barId] = status.isSaved;
          });
          return newSavedBars;
        });
      } catch (error) {
        console.error('無法獲取酒吧狀態:', error);
      }
    },
    [auth.id],
  );

  const barIdsString = useMemo(() => {
    return randomBars.map((bar) => bar.bar_id).join(',');
  }, [randomBars]);

  useEffect(() => {
    if (barIdsString && auth.id !== 0) {
      checkBarsStatus(barIdsString);
    }
  }, [barIdsString, checkBarsStatus, auth.id]);

  // next 3 random
  useEffect(() => {
    getBarListRandom();
  }, [barRender, getBarListRandom]);

  // 上一頁酒吧
  const prevBars = () => {
    setCurrentIndex(
      (prev) => (prev - displayCount + randomBars.length) % randomBars.length,
    );
  };

  // 下一頁酒吧
  const nextBars = () => {
    setCurrentIndex(
      (prev) => (prev + displayCount) % randomBars.length,
    );
  };

  // Calculate the bars to be displayed based on the current index
  const displayedBars = randomBars
    .slice(currentIndex, currentIndex + displayCount)
    .concat(
      randomBars.slice(
        0,
        Math.max(displayCount - (randomBars.length - currentIndex), 0),
      ),
    );

  const initialTabs = [
    { title: '酒吧地圖', path: '/under-construction', active: false },
    { title: '酒吧首頁', path: '/bar', active: true },
    { title: '訂位紀錄', path: '/under-construction', active: false, isProtected: true },
  ];
  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="fixed z-40 justify-center w-full h-8 mx-auto top-16 bg-dark">
        <TabBar tabs={initialTabs} />
      </div>
      <div className="container flex items-center justify-center w-full pt-24 mx-auto bar md:w-8/12">
        <div className="flex flex-col bar-index-content">
          {isLoading ? (
            <Loader minHeight="100vh" text="正在探索驚喜酒吧..." />
          ) : (
            <>
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
                  <button type="button" onClick={prevBars}>
                    <MdOutlineArrowBackIos className="text-[#A0FF1F] text-[30px]" />
                  </button>
                  {displayedBars.map((randomBar) => (
                    <BarCardIndex
                      key={randomBar.bar_id}
                      randomBar={randomBar}
                      savedBars={savedBars}
                      setSavedBars={setSavedBars}
                    />
                  ))}
                  <button type="button" onClick={nextBars}>
                    <MdOutlineArrowForwardIos className="text-[#A0FF1F] text-[30px]" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center w-100 md:hidden">
                <div className="gap-5 carousel rounded-box">
                  <div className="gap-5 carousel-item">
                    {displayedBars.slice(0, 2).map((randomBar) => (
                      <BarCardIndex
                      key={randomBar.bar_id}
                      randomBar={randomBar}
                      savedBars={savedBars}
                      setSavedBars={setSavedBars}
                    />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
