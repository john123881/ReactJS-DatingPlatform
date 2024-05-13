import { useEffect, useState } from 'react';
import TabBar from '@/components/bar/bar/tab-bar';
import BarBookingListCard from '@/components/bar/card/bar-booking-list-card';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function Booking({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(4); // 每頁顯示的訂位紀錄數量

  useEffect(() => {
    // 定義取得資料的函數
    const fetchData = async () => {
      // 檢查路由中是否有 user_id
      if (!router.query.user_id) return;

      // 構建 API 請求 URL
      const url = `http://localhost:3001/bar/bar-booking-list/${router.query.user_id}`;
      try {
        // 發送 GET 請求並等待回應
        const response = await fetch(url);
        // 解析回應為 JSON 格式
        const data = await response.json();
        // 檢查資料是否為陣列
        if (Array.isArray(data)) {
          // 更新狀態中的訂位紀錄
          setBookings(data);
        } else {
          // 如果資料不是陣列，則將其轉換為陣列
          setBookings([data]);
        }
      } catch (error) {
        // 如果發生錯誤，輸出錯誤訊息到控制台
        console.error('Failed to fetch bar booking list:', error);
      }
    };

    // 執行取得資料的函數
    fetchData();
  }, [router.query.user_id]); // 在路由中的 user_id 改變時重新請求資料

  // 計算總頁數
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);
  // 計算當前頁的第一筆和最後一筆索引
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  // 根據索引切割當前頁的訂位紀錄
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // 處理頁碼變更事件的函數
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 初始選單分頁標籤
  const initialTabs = [
    { title: '酒吧地圖', path: '/bar/bar-map', active: false },
    { title: '酒吧首頁', path: '/bar', active: false },
    { title: '訂位紀錄', path: '/bar/bar-booking-list', active: true },
  ];

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      {/* 頁面頂部固定 TabBar */}
      <div className="fixed z-40 justify-center w-full h-8 mx-auto top-16 bg-dark">
        <TabBar tabs={initialTabs} />
      </div>

      {/* 訂位紀錄列表 */}
      <div className="flex flex-row justify-center pt-28">
        {/* 左側空白欄 */}
        <div className="w-1/12 md:w-2/12"></div>
        {/* 中間主要內容 */}
        <div className="w-10/12 md:w-8/12">
          {/* 訂位紀錄卡片列表 */}
          <div className="space-y-4 bar-booking-list">
            <div className="text-[15px] lg:text-[16px] text-white">
              {/* username */}
            </div>
            {currentBookings.map((booking, i) => (
              <BarBookingListCard
                booking={booking}
                bookingId={booking.bar_booking_id} // 使用新的 prop 名稱
                key={booking.bar_booking_id} // 保留 key 屬性
              />
            ))}
          </div>
          {/* 分頁控制按鈕 */}
          <div className="flex items-center justify-center">
            {/* 上一頁按鈕 */}
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {/* 顯示頁碼數字，最多顯示 5 頁 */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => (
              <button
                key={index + 1}
                className={`btn btn-sm ${
                  currentPage === index + 1 ? 'btn-active' : ''
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            {/* 下一頁按鈕 */}
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
        {/* 右側空白欄 */}
        <div className="w-1/12 md:w-2/12"></div>
      </div>
    </>
  );
}
