import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useRouter } from 'next/router';
import IndexMovieCard from '@/components/booking/card/indexMovieCard';
import PageTitle from '@/components/page-title';
import Link from 'next/link';
import { IoTicketOutline } from 'react-icons/io5';

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
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const [isHovered1, setIsHovered1] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [movieCards, setMovieCards] = useState([]);

  const getBookingMovieCard = async () => {
    try {
      const res = await fetch('http://localhost:3001/booking/index-movie-list');
      const data = await res.json();
      // console.log('asdsadcasc===>>>', data);
      setMovieCards(data);
    } catch (error) {
      console.log('Failed to fetch movie card', error);
    }
  };

  const handleTabClick = () => {
    getBookingMovieCard(); // 點擊標籤時重新 fetch 電影卡片數據
  };


  const [clickedButton, setClickedButton] = useState(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    getBookingMovieCard();
  }, []);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      {/* 輪播圖片 */}
      <div className="relative">
        <div
          className="hidden lg:carousel lg:w-full"
          style={{ height: '530px' }}
        >
          <div id="slide1" className="relative w-full mt-20 carousel-item">
            <img
              src="/00000.jpeg"
              className="w-full"
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a
                href="#slide4"
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❮
              </a>
              <a
                href="#slide2"
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❯
              </a>
            </div>
          </div>
          <div
            id="slide2"
            className="carousel-item relative w-full mt-20 h-[550px]"
          >
            <img src="/1111.jpeg" className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a
                href="#slide1"
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❮
              </a>
              <a
                href="#slide3"
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❯
              </a>
            </div>
          </div>
          <div id="slide3" className="relative w-full carousel-item">
            <img
              src="https://daisyui.com/images/stock/photo-1414694762283-acccc27bca85.jpg"
              className="w-full"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a
                href="#slide2"
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❮
              </a>
              <a
                href="#slide4"
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❯
              </a>
            </div>
          </div>
          <div id="slide4" className="relative w-full carousel-item">
            <img
              src="https://daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg"
              className="w-full"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a
                href="#slide3"
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❮
              </a>
              <a
                href="#slide1"
                className="btn btn-circle"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                ❯
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 justify-center hidden w-full gap-3 py-2 pt-10 pb-10 lg:flex">
          <a href="#slide1" className="btn btn-xs"></a>
          <a href="#slide2" className="btn btn-xs"></a>
          <a href="#slide3" className="btn btn-xs"></a>
          <a href="#slide4" className="btn btn-xs"></a>
        </div>
      </div>

      {/* button */}
      <div className="flex justify-center pt-20 lg:pt-10 ">
        <div
          role="tablist"
          className="tabs tabs-boxed"
          style={{
            width: '200px',
            borderRadius: '30px', // 將外框設置為圓形
            borderColor: 'rgba(12, 255, 31, 0.5)',
          }}
        >
          <a
            role="tab"
            className="tab"
            style={{
              width: '100px',
              borderRadius: '30px',
              transition: 'transform 0.3s ease-in-out', // 添加过渡效果
              transform: 'translateX(0px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-2px)'; // 鼠标移入时左移5像素
              e.target.style.backgroundColor = '#A0FF1F'; // 鼠标移入时改变颜色
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)'; // 鼠标移出时回到原始位置
              e.target.style.backgroundColor = 'transparent'; // 鼠标移出时恢复原始颜色
            }}
            onClick={handleTabClick}
          >
            現正熱播
          </a>
          <a
            role="tab"
            className="tab"
            style={{
              width: '100px',
              borderRadius: '30px',
              transition: 'transform 0.3s ease-in-out', // 添加过渡效果
              transform: 'translateX(0px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(2px)'; // 鼠标移入时左移5像素
              e.target.style.backgroundColor = '#A0FF1F'; // 鼠标移入时改变颜色
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)'; // 鼠标移出时回到原始位置
              e.target.style.backgroundColor = 'transparent'; // 鼠标移出时恢复原始颜色
            }}
            onClick={handleTabClick}

            // style={{
            //   width: '100px',
            //   // backgroundColor: '#A0FF1F',
            //   transition: 'transform 0.3s ease-in-out', // 添加过渡效果
            //   ':hover': { transform: 'translateX(5px)' } // 悬停时向右移动5像素
            // }}
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
          // onClick={() => {
          //   setClickedButton(!clickedButton);
          //   window.location.href = '../..//booking/movie-ticket';
          // }}
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
          onMouseEnter={() => setIsHovered1(true)}
          onMouseLeave={() => setIsHovered1(false)}
          // onClick={() => {
          //   // 點擊按鈕後執行瀏覽器重定向
          //   window.location.href = '/booking/movie-list'; // 替換 '/movies' 為您電影列表頁面的實際路徑
          // }}
        >
          看更多
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mx-4 sm:justify-between">
        {movieCards.map((movie, index) => (
          <IndexMovieCard movie={movie} key={index} />
        ))}
      </div>
    </>
  );
}
