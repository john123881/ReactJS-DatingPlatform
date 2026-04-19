import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { BarService } from '@/services/bar-service';
import Loader from '@/components/ui/loader/loader';
import BarLayout from '@/components/bar/layout/bar-layout';
import BarCardIndex from '@/components/bar/card/bar-card-index';
import BarIndexHero from '@/components/bar/section/bar-index-hero';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { useAuth } from '@/context/auth-context';

export default function Index({ onPageChange }) {
  const { auth } = useAuth();
  const pageTitle = '酒吧探索';
  const router = useRouter();

  const [randomBars, setRandomBars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [savedBars, setSavedBars] = useState({});
  const displayCount = 3;

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

  useEffect(() => {
    onPageChange(pageTitle);
    getBarListRandom();
  }, [onPageChange, pageTitle, getBarListRandom]);

  const prevBars = () => {
    setCurrentIndex(
      (prev) => (prev - displayCount + randomBars.length) % randomBars.length,
    );
  };

  const nextBars = () => {
    setCurrentIndex(
      (prev) => (prev + displayCount) % randomBars.length,
    );
  };

  const displayedBars = randomBars
    .slice(currentIndex, currentIndex + displayCount)
    .concat(
      randomBars.slice(
        0,
        Math.max(displayCount - (randomBars.length - currentIndex), 0),
      ),
    ).slice(0, displayCount);

  if (isLoading) return <Loader minHeight="100vh" text="正在探索驚喜酒吧..." />;

  return (
    <BarLayout title={pageTitle}>
      <div className="container flex items-center justify-center w-full pt-24 mx-auto bar md:w-8/12">
        <div className="flex flex-col w-full">
          {/* Hero Section Module */}
          <BarIndexHero />

          <div className="text-[18px] md:text-[28px] text-white font-bold text-center mb-10 mt-12">
            熱門酒吧 <span className="text-[#A0FF1F]">HOT BARS</span>
          </div>

          <div className="hidden player-wall md:flex md:justify-center md:items-center pb-24">
            <div className="flex items-center justify-center gap-16">
              <button 
                type="button" 
                onClick={prevBars}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[#A0FF1F] hover:bg-[#A0FF1F] hover:text-black transition-all"
              >
                <MdOutlineArrowBackIos className="ml-2" />
              </button>
              
              <div className="grid grid-cols-3 gap-10">
                {displayedBars.map((randomBar, index) => (
                  <div key={randomBar.bar_id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                    <BarCardIndex
                      randomBar={randomBar}
                      savedBars={savedBars}
                      setSavedBars={setSavedBars}
                    />
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={nextBars}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[#A0FF1F] hover:bg-[#A0FF1F] hover:text-black transition-all"
              >
                <MdOutlineArrowForwardIos className="ml-1" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center w-100 md:hidden pb-12">
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
        </div>
      </div>
    </BarLayout>
  );
}
