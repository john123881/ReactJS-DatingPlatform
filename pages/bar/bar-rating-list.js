import { useEffect, useState } from 'react';
import TabBar from '@/components/bar/bar/tab-bar';
import BarReviewCard from '@/components/bar/card/bar-review-card';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function BarRatingList({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const initialTabs = [
    { title: '酒吧地圖', path: '/bar/bar-map', active: false },
    { title: '酒吧首頁', path: '/bar', active: true },
    { title: '訂位紀錄', path: '/bar/bar-booking-list', active: false },
  ];
  // const currentPage = '評論';

  const [ratings, setRatings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingsPerPage] = useState(5); // 每頁顯示的評論數

  // pagination
  // 計算當前頁面的評論
  const indexOfLastRating = currentPage * ratingsPerPage;
  const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
  const currentRatings = ratings.slice(indexOfFirstRating, indexOfLastRating);

  // 計算總頁數
  const totalPages = Math.ceil(ratings.length / ratingsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getBarRating = async () => {
    const url = `http://localhost:3001/bar/bar-rating`;
    const response = await fetch(url);
    const data = await response.json();
    setRatings(data);
  };

  useEffect(() => {
    getBarRating();
  }, []);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="fixed z-40 justify-center w-full h-8 mx-auto top-16 bg-dark">
        <TabBar tabs={initialTabs} />
      </div>

      <div className="flex flex-row justify-center h-screen gap-4 pt-28">
        {/* 左留 2/12 空白 */}
        <div className="w-1/12 md:w-2/12"></div>
        <div className="w-10/12 md:w-8/12">
          <div className="text-sm breadcrumbs">
            <Breadcrumbs currentPage="評論" />
          </div>
          <div className="text-[22px] text-white mb-4">
            Fake Sober Taipei
            {/* {bars.bar_name} */}
          </div>
          <div>
            {currentRatings.map((rating, index) => (
              <BarReviewCard key={index} rating={rating} />
            ))}
          </div>
          <div className="flex items-center justify-center ">
            <button
              className="btn btn-sm "
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => (
              <button
                key={index + 1}
                className={`btn btn-sm ${
                  currentPage === index + 1 ? 'btn-active' : ''
                }`}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  backgroundColor: currentPage === index + 1 ? '#A0FF1F' : '',
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
        {/* 右留 2/12 空白 */}
        <div className="w-1/12 md:w-2/12"></div>
      </div>
    </>
  );
}
