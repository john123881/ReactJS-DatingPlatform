import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import IndexMovieCard from '@/components/booking/card/indexMovieCard';
import PageTitle from '@/components/page-title';
import { BookingService } from '@/services/booking-service';
import Link from 'next/link';
import { IoTicketOutline } from 'react-icons/io5';
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
  const [activeTab, setActiveTab] = useState('now'); // 'now' or 'soon'
  const [movieCards, setMovieCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // 自動輪播
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % totalSlides;
      scrollToSlide(nextSlide);
    }, 5000); // 5秒換一次

    return () => clearInterval(interval);
  }, [currentSlide]);

  const getBookingMovieCard = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await BookingService.getIndexMovies();
      setMovieCards(data);
    } catch (error) {
      console.error('Failed to fetch movie card', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    getBookingMovieCard(); // 點擊標籤時重新 fetch 電影卡片數據
  };

  const [clickedButton, setClickedButton] = useState(null);
  const [hovered, setHovered] = useState(false);

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
      <div className="relative mt-20">
        <div
          ref={carouselRef}
          className="hidden lg:flex overflow-x-hidden scroll-smooth w-full"
          style={{ height: '530px' }}
        >
          <div className="relative inline-block w-full flex-shrink-0 h-full">
            <Image
              src="/00000.jpeg"
              className="w-full h-full"
              width={1920}
              height={530}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              alt="電影海報 1"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <button
                onClick={() => scrollToSlide(3)}
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❮
              </button>
              <button
                onClick={() => scrollToSlide(1)}
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❯
              </button>
            </div>
          </div>
          <div className="relative inline-block w-full flex-shrink-0 h-full">
            <Image
              src="/1111.jpeg"
              className="w-full h-full"
              width={1920}
              height={530}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              alt="電影海報 2"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <button
                onClick={() => scrollToSlide(0)}
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❮
              </button>
              <button
                onClick={() => scrollToSlide(2)}
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❯
              </button>
            </div>
          </div>
          <div className="relative inline-block w-full flex-shrink-0 h-full">
            <Image
              src="https://daisyui.com/images/stock/photo-1414694762283-acccc27bca85.jpg"
              className="w-full h-full"
              width={1920}
              height={530}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              alt="電影海報 3"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <button
                onClick={() => scrollToSlide(1)}
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❮
              </button>
              <button
                onClick={() => scrollToSlide(3)}
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❯
              </button>
            </div>
          </div>
          <div className="relative inline-block w-full flex-shrink-0 h-full">
            <Image
              src="https://daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg"
              className="w-full h-full"
              width={1920}
              height={530}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              alt="電影海報 4"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <button
                onClick={() => scrollToSlide(2)}
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❮
              </button>
              <button
                onClick={() => scrollToSlide(0)}
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❯
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 justify-center hidden w-full gap-3 py-2 pt-10 pb-10 lg:flex">
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
      <div className="flex justify-center pt-20 lg:pt-10 ">
        <div
          role="tablist"
          className="tabs tabs-boxed bg-transparent border border-neongreen/30"
          style={{
            width: '240px',
            borderRadius: '30px',
          }}
        >
          <a
            role="tab"
            className={`tab h-full transition-all duration-300 ${activeTab === 'now' ? 'bg-neongreen text-black' : 'text-white hover:text-neongreen'}`}
            style={{
              width: '120px',
              borderRadius: '30px',
            }}
            onClick={() => handleTabClick('now')}
          >
            現正熱播
          </a>
          <a
            role="tab"
            className={`tab h-full transition-all duration-300 ${activeTab === 'soon' ? 'bg-neongreen text-black' : 'text-white hover:text-neongreen'}`}
            style={{
              width: '120px',
              borderRadius: '30px',
            }}
            onClick={() => handleTabClick('soon')}
          >
            即將上映
          </a>
        </div>
      </div>

      <div className="flex justify-end w-full mt-5 ml-[-20px] sm:ml-[-70px]">
        <Link
          className="btn btn-outline bg-transparent mt-[10px] w-[150px] mb-[30px] rounded-[30px] hover:bg-[#A0FF1F]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          href={'booking/movie-ticket'}
        >
          {/* 愛心圖標 */}
          <IoTicketOutline
            className="IoTicketOutline"
            style={{
              color: clickedButton ? '#FF03FF' : hovered ? '#A0FF1F' : 'white',
              cursor: 'pointer',
            }}
            onClick={() => {
              // 切換按鈕點擊狀態
              setClickedButton(clickedButton === 'heart' ? null : 'heart');
            }}
          />
          我的電影票
        </Link>
        <Link
          className="btn btn-outline bg-transparent mt-[10px] w-[80px] mb-[30px] rounded-[30px] hover:bg-[#A0FF1F] mx-3"
          href={'booking/movie-list'}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          看更多
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mx-4 sm:justify-between min-h-[400px]">
        {isLoading ? (
          <Loader minHeight="400px" text="正在載入熱門電影..." />
        ) : (
          movieCards.map((movie, index) => (
            <IndexMovieCard movie={movie} key={index} />
          ))
        )}
      </div>
    </>
  );
}
