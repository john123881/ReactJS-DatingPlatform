import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import TabBar from '@/components/bar/bar/tab-bar';
import BarBookingListCard from '@/components/bar/card/bar-booking-list-card';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function BarBookingList({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const { auth } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(4); // 每頁顯示的訂位紀錄數量

  const getBarBookingList = async () => {
    const url = `http://localhost:3001/bar/bar-booking-list`;
    const response = await fetch(url);
    const data = await response.json();
    setBookings(data);
  };

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null) {
      getBarBookingList();
    }
  }, [auth.id]);

  // pagination start
  // 總頁數
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  // 當前頁的訂位紀錄
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // 分頁變更處理函數
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // pagination end

  const initialTabs = [
    { title: '酒吧地圖', path: '/bar/bar-map', active: false },
    { title: '酒吧首頁', path: '/bar', active: false },
    { title: '訂位紀錄', path: '/bar/bar-booking-list', active: true },
  ];
  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="fixed z-40 justify-center w-full h-8 mx-auto top-16 bg-dark">
        <TabBar tabs={initialTabs} />
      </div>

      <div className="flex flex-row justify-center pt-28 h-screen">
        {/* 左留 2/12 空白 */}
        <div className="w-1/12 md:w-2/12"></div>
        <div className="w-10/12 md:w-8/12">
          <div className="text-[15px] lg:text-[16px] text-white">
            {/* username */}
            {/* {booking.username} */}
          </div>
          <div className="space-y-4 bar-booking-list mt-4">
            {currentBookings.map((booking, i) => (
              <BarBookingListCard
                booking={booking}
                key={booking.bar_booking_id}
                onDelete={() => deleteBooking(booking.bar_booking_id)}
                setBookings={setBookings} // 傳遞 setBookings 函數
              />
            ))}
          </div>
          {/* 分頁控制按鈕 */}
          <div className="flex items-center justify-center mt-8">
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {/* 顯示頁碼數字，最多顯示5頁 */}
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
