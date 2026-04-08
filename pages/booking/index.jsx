import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import IndexMovieCard from '@/components/booking/card/indexMovieCard';
import PageTitle from '@/components/page-title';
import { useAuth } from '@/context/auth-context';
import { BookingService } from '@/services/booking-service';
import Link from 'next/link';
import { IoTicketOutline } from 'react-icons/io5';
import MovieCardSkeleton from '@/components/booking/card/movieCardSkeleton';
import Loader from '@/components/ui/loader/loader';

// const mockData1 = [
//   { movieName: '奧本海默' },
//   { movieName: 'Movie 2' },
//   { movieName: 'Movie 3' },
//   { movieName: 'Movie 4' },
//   { movieName: 'Movie 5' },
//   { movieName: 'Movie 6' },
//   { movieName: 'Movie 7' }, // 新增的卡片
//   { movieName: 'Movie 8' }, // 新增的卡片
// ];

export default function Index({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  const carouselRef = useRef(null);
  const { auth, setLoginModalToggle } = useAuth();
  const [activeTab, setActiveTab] = useState('now'); // 'now' or 'soon'
  const [movieCards, setMovieCards] = useState([]);
  const [savedMovies, setSavedMovies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const movieContainerRef = useRef(null);
  const [movieScrollIndex, setMovieScrollIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollMovieSlider = (index) => {
    setMovieScrollIndex(index);
  };

  const totalSlides = 4;

  const scrollToSlide = (index) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * index;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setCurrentSlide(index);
    }
  };

  // 監聽手動捲動以更新分頁點點
  useEffect(() => {
    const handleCarouselScroll = () => {
      if (carouselRef.current) {
        const scrollLeft = carouselRef.current.scrollLeft;
        const width = carouselRef.current.offsetWidth;
        const newIndex = Math.round(scrollLeft / width);
        if (newIndex !== currentSlide) {
          setCurrentSlide(newIndex);
        }
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleCarouselScroll);
    }
    return () => carousel?.removeEventListener('scroll', handleCarouselScroll);
  }, [currentSlide]);

  // 自動輪播
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % totalSlides;
      scrollToSlide(nextSlide);
    }, 5000); // 5秒換一次

    return () => clearInterval(interval);
  }, [currentSlide]);

  const checkMoviesStatus = useCallback(async (movieIds) => {
    const userId = auth.id;
    if (userId === 0 || !movieIds) return;

    try {
      const data = await BookingService.checkMovieStatus(userId, movieIds);
      const newSavedMovies = {};
      data.forEach((status) => {
        newSavedMovies[status.movieId] = status.isSaved;
      });
      setSavedMovies(newSavedMovies);
    } catch (error) {
      console.error('無法獲取電影狀態:', error);
    }
  }, [auth.id]);

  const getBookingMovieCard = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await BookingService.getIndexMovies();
      setMovieCards(data || []);
      
      if (data && data.length > 0 && auth.id !== 0) {
        const movieIds = data.map((movie) => movie.movie_id).join(',');
        checkMoviesStatus(movieIds);
      }
    } catch (error) {
      console.error('Failed to fetch movie card', error);
    } finally {
      setIsLoading(false);
    }
  }, [auth.id, checkMoviesStatus]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    getBookingMovieCard(); // 點擊標籤時重新 fetch 電影卡片數據
  };

  const [clickedButton, setClickedButton] = useState(null);

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  useEffect(() => {
    getBookingMovieCard();
  }, [getBookingMovieCard]);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      {/* 輪播圖片 */}
      <div className="relative mt-16 sm:mt-20 transition-all duration-300">
        <div
          ref={carouselRef}
          className="flex overflow-x-hidden scroll-smooth w-full h-[250px] sm:h-[530px]"
        >
          <div className="relative inline-block w-full flex-shrink-0 h-full bg-black overflow-hidden group">
            {/* 背景動態裝飾球 */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-neongreen/20 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-purple-600/20 rounded-full blur-[120px]"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 lg:p-10 text-center gap-4 lg:gap-8 z-10">
               <div className="border-2 border-neongreen px-8 py-2 rounded-full text-neongreen text-xl lg:text-2xl font-black tracking-widest animate-pulse shadow-[0_0_20px_rgba(0,255,0,0.3)]">
                 提醒您
               </div>
               
               <div className="max-w-5xl bg-black/60 backdrop-blur-xl p-8 lg:p-12 rounded-[2rem] border border-white/10 shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
                 <h2 className="text-3xl lg:text-5xl font-black text-red-500 mb-6 lg:mb-8 drop-shadow-[0_0_15px_rgba(255,0,0,0.6)] tracking-tight">
                   維護資訊安全 • 防範冒名詐騙
                 </h2>
                 <div className="space-y-4 lg:space-y-6">
                    <p className="text-lg lg:text-2xl text-white leading-relaxed font-bold">
                      近期本公司遭不肖人士以諸多手法進行冒名詐騙，威秀影城已報警。
                    </p>
                    <p className="text-base lg:text-xl text-gray-300 leading-relaxed">
                      威秀影城絕不會主動致電給顧客，或要求顧客轉帳或操作銀行帳戶與信用卡設定。
                    </p>
                    <p className="text-xl lg:text-3xl text-neongreen font-black underline underline-offset-8 decoration-2 drop-shadow-[0_0_10px_rgba(0,255,0,0.4)]">
                      請勿相信不明來電訊息或回撥對方所提供之電話。
                    </p>
                    
                    {/* 將 165 資訊移入框內，避免擋到分頁點點 */}
                    <div className="pt-6 border-t border-white/5">
                      <p className="text-gray-400 text-sm lg:text-lg font-medium">
                        若您接獲可疑電話，請立即掛斷，並撥打警政署 <span className="text-white font-bold">165</span> 反詐騙專線。
                      </p>
                    </div>
                 </div>
               </div>
            </div>

            <div className="absolute hidden sm:flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-20">
              <button
                onClick={() => scrollToSlide(3)}
                className="btn btn-circle bg-black/40 border-none text-white hover:bg-neongreen hover:text-black transition-all"
              >
                ❮
              </button>
              <button
                onClick={() => scrollToSlide(1)}
                className="btn btn-circle bg-black/40 border-none text-white hover:bg-neongreen hover:text-black transition-all"
              >
                ❯
              </button>
            </div>
          </div>
          <div className="relative inline-block w-full flex-shrink-0 h-full bg-black">
            <Image
              src="/00000.jpeg"
              className="w-full h-full"
              width={1920}
              height={530}
              sizes="100vw"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              alt="電影海報 2"
            />
            <div className="absolute hidden sm:flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-20">
              <button
                onClick={() => scrollToSlide(0)}
                className="btn btn-circle bg-black/40 border-none text-white hover:bg-neongreen hover:text-black transition-all"
              >
                ❮
              </button>
              <button
                onClick={() => scrollToSlide(2)}
                className="btn btn-circle bg-black/40 border-none text-white hover:bg-neongreen hover:text-black transition-all"
              >
                ❯
              </button>
            </div>
          </div>
          <div className="relative inline-block w-full flex-shrink-0 h-full bg-black">
            <Image
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&h=530&fit=crop"
              unoptimized={true}
              className="w-full h-full"
              width={1920}
              height={530}
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
              alt="電影海報 3"
            />
            <div className="absolute hidden sm:flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-20">
              <button
                onClick={() => scrollToSlide(1)}
                className="btn btn-circle bg-black/40 border-none text-white hover:bg-neongreen hover:text-black transition-all"
              >
                ❮
              </button>
              <button
                onClick={() => scrollToSlide(3)}
                className="btn btn-circle bg-black/40 border-none text-white hover:bg-neongreen hover:text-black transition-all"
              >
                ❯
              </button>
            </div>
          </div>
          <div className="relative inline-block w-full flex-shrink-0 h-full">
            <Image
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1920&h=530&fit=crop"
              unoptimized={true}
              className="w-full h-full"
              width={1920}
              height={530}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              alt="電影海報 4"
            />
            <div className="absolute hidden sm:flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-20">
              <button
                onClick={() => scrollToSlide(2)}
                className="btn btn-circle bg-black/40 border-none text-white hover:bg-neongreen hover:text-black transition-all"
              >
                ❮
              </button>
              <button
                onClick={() => scrollToSlide(0)}
                className="btn btn-circle bg-black/40 border-none text-white hover:bg-neongreen hover:text-black transition-all"
              >
                ❯
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 justify-center flex w-full gap-2 sm:gap-3 py-2 pt-6 pb-6 lg:pb-10 z-30">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              className={`btn btn-xs ${currentSlide === idx ? 'bg-neongreen border-neongreen' : ''}`}
            ></button>
          ))}
        </div>
      </div>


      {/* button */}
      <div className="flex justify-center pt-10 lg:pt-8">
        <div
          role="tablist"
          className="tabs tabs-boxed bg-transparent border border-neongreen/30 p-0 overflow-hidden"
          style={{
            width: '240px',
            height: '40px',
            borderRadius: '30px',
          }}
        >
          <a
            role="tab"
            className={`tab flex-1 h-full transition-all duration-300 ${activeTab === 'now' ? 'bg-neongreen text-black' : 'text-white hover:text-neongreen'}`}
            style={{
              borderRadius: '30px',
            }}
            onClick={() => handleTabClick('now')}
          >
            現正熱播
          </a>
          <a
            role="tab"
            className={`tab flex-1 h-full transition-all duration-300 ${activeTab === 'soon' ? 'bg-neongreen text-black' : 'text-white hover:text-neongreen'}`}
            style={{
              borderRadius: '30px',
            }}
            onClick={() => handleTabClick('soon')}
          >
            即將上映
          </a>
        </div>
      </div>

      <div className="sticky top-[64px] z-30 sm:static flex flex-wrap justify-center sm:justify-end w-full mt-5 px-6 gap-2 sm:gap-3 mb-6 py-4 bg-black/60 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:mt-5 transition-all duration-300">
        <Link
          className="btn btn-outline bg-transparent w-[150px] rounded-[30px] hover:bg-neongreen hover:text-black group active:scale-95 transition-all flex items-center gap-2 border-neongreen/50"
          href={'/under-construction'}
          onClick={(e) => {
            if (auth.id === 0) {
              e.preventDefault();
              setLoginModalToggle(true);
            }
          }}
        >
          <IoTicketOutline
            className={`IoTicketOutline text-xl transition-colors duration-300 ${
              clickedButton ? 'text-[#FF03FF]' : 'text-white group-hover:text-black'
            }`}
          />
          <span className="whitespace-nowrap">我的電影票</span>
        </Link>
        <Link
          className="btn btn-outline bg-transparent w-[100px] rounded-[30px] hover:bg-neongreen hover:text-black active:scale-95 transition-all text-xs sm:text-sm"
          href={'/booking/movie-list'}
        >
          看更多
        </Link>
      </div>

      <div 
        className="flex flex-col items-center w-full min-h-screen pb-20 mt-4 sm:mt-10 transition-colors duration-500 overflow-hidden"
        style={{ 
          background: 'radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative max-w-[1440px] px-10 group/slider">
          {/* Navigation Arrows */}
          <button 
            onClick={() => scrollMovieSlider(Math.max(0, movieScrollIndex - 1))}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 border border-white/10 rounded-full text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-neongreen hover:text-black"
          >
            ❮
          </button>
          
          <div 
            ref={movieContainerRef}
            className="flex justify-center items-stretch gap-6 pt-4 pb-10 sm:py-10 h-[520px]"
          >
            {isLoading ? (
              Array.from({ length: 1 }).map((_, i) => (
                <div key={i} className="w-full max-w-[300px]">
                  <MovieCardSkeleton />
                </div>
              ))
            ) : (
              movieCards.slice(0, 5).map((movie, index) => {
                // 決定在不同斷點下是否顯示
                // 手機版：只顯示當前 index
                const isVisibleMobile = index === movieScrollIndex;
                
                // 平板版 (sm/md): 顯示 2 張
                const isVisibleSm = index >= movieScrollIndex && index < movieScrollIndex + 2;
                
                // 桌機版 (lg): 顯示 3 張
                const isVisibleLg = index >= movieScrollIndex && index < movieScrollIndex + 3;
                
                // 大桌機版 (xl): 全部顯示 (5張)
                const isVisibleXl = index >= movieScrollIndex && index < movieScrollIndex + 4; 

                return (
                  <div 
                    key={movie.movie_id || index} 
                    className={`flex-shrink-0 transition-all duration-500 animate__animated animate__fadeIn 
                      ${isVisibleMobile ? 'block w-[280px]' : 'hidden'} 
                      ${isVisibleSm ? 'sm:block sm:w-[calc(50%-12px)]' : 'sm:hidden'}
                      ${isVisibleLg ? 'lg:block lg:w-[calc(33.33%-16px)]' : 'lg:hidden'}
                      ${isVisibleXl ? 'xl:block xl:w-[calc(25%-18px)]' : 'xl:hidden'}
                    `}
                  >
                    <IndexMovieCard 
                      movie={movie} 
                      isSaved={savedMovies[movie.movie_id] || false}
                    />
                  </div>
                );
              })
            )}
          </div>

          <button 
            onClick={() => scrollMovieSlider(Math.min(4, movieScrollIndex + 1))}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 border border-white/10 rounded-full text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-neongreen hover:text-black"
          >
            ❯
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-4 pb-10 xl:hidden">
            {movieCards.slice(0, 5).map((_, idx) => {
              // On desktop, if we show 3 items, the dots should be restricted to indexes 0, 1, 2
              // But the user said "對應的資料解開隱藏", so maybe each dot -> one card?
              // I'll keep 5 dots for now, but on desktop it might show that card and the next two.
              return (
                <button
                  key={idx}
                  onClick={() => scrollMovieSlider(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    movieScrollIndex === idx 
                      ? 'w-8 h-2 bg-neongreen shadow-[0_0_10px_#39FF14]' 
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
