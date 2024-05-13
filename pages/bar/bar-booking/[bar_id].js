import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function Booking({ onPageChange }) {
  const pageTitle = '酒吧訂位';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const { auth } = useAuth();

  const [booking, setBooking] = useState([]);
  const currentPage = booking[0]?.bar_name;

  const [selectedTime, setSelectedTime] = useState('');

  const [bookingDate, setBookingDate] = useState('');
  const [peopleNum, setPeopleNum] = useState('');

  const timeSlotMapping = {
    '19:00': 1,
    '20:00': 2,
    '21:00': 3,
    '22:00': 4, // 如果需要可以加入更多時間
  };

  // 訂位時間按鈕
  const handleTimeSelect = (time) => {
    setSelectedTime(time); // Update the selected time state
  };

  //FETCH GET 酒吧資料
  const getBarBookingById = async (bar_id) => {
    // console.log('func barId:', bar_id);
    const url = `http://localhost:3001/bar/bar-list/id/${bar_id}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log('fetch data', data);
    // // console.log('getBarListDynamicById 的 data:', data);

    // const barIds = data.map((bar) => bar.bar_id).join(',');
    // checkBarsStatus(barIds); //確認Saved or not 狀態的fetch
    setBooking(data);
  };

  // 提交訂位資料到後端
  const handleBookingSubmit = async (event) => {
    event.preventDefault(); // 阻止表單的默認提交行為

    if (!bookingDate || !peopleNum || !selectedTime) {
      alert('請完整填寫訂位資訊');
      return;
    }

    const bookingData = {
      user_id: auth.id, // 通常從用戶狀態或身份驗證服務獲得
      bar_id: booking[0]?.bar_id, // 從狀態或路由獲得
      bar_booking_time: `${bookingDate}`,
      bar_booking_people_num: peopleNum,
      bar_time_slot_id: timeSlotMapping[selectedTime],
    };

    // console.log(bookingData);
    if (!bookingData) {
      Swal.fire({
        title: '請輸入訂位內容!',
        icon: 'warning',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      });
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3001/bar/create-bar-booking',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
      }
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: '訂位成功!',
          icon: 'success',
          confirmButtonText: '關閉',
          confirmButtonColor: '#A0FF1F',
          background: 'rgba(0, 0, 0, 0.85)',
        });
      }
    } catch (error) {
      console.error('訂位失敗:', error);
      Swal.fire({
        title: '訂位失敗!',
        icon: 'error',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      });
    }
  };

  // 動態路由成功
  useEffect(() => {
    if (router.isReady) {
      //確保能得到bar_id
      const { bar_id } = router.query;
      // 有bar_id後，向伺服器要求資料
      console.log('barId:', bar_id);
      getBarBookingById(bar_id);
    }
  }, [router.isReady]);

  // useEffect(() => {
  //   console.log(booking.bar_name); // 查看 booking 數據結構
  //   // console.log('booking:', booking[0]);
  // }, [booking]);

  // 訂位確認彈跳視窗
  // const BookingConfirmModal = dynamic(
  //   () => import('@/components/bar/modal/booking-confirm-modal'),
  //   { ssr: false }
  // );
  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-row justify-center gap-4 pt-20 h-screen">
        {/* 左留 2/12 空白 */}
        <div className="w-1/12 md:w-2/12"></div>

        <div className="w-10/12 gap-4 md:w-8/12 lg:grid lg:grid-cols-12">
          {/* 表單內容部分占全部8列，在md時占5列 */}
          <div className="lg:col-span-5">
            <div className="text-sm breadcrumbs">
              <Breadcrumbs currentPage={currentPage} />
            </div>
            <div className="space-y-2">
              <div className="text-white text-[18px]">我要訂位</div>
              {/* 移動端顯示的圖片 */}
              <div className="lg:hidden">
                <img
                  className="w-[340px] h-[130px] object-cover rounded-[20px]"
                  src={booking[0]?.bar_img}
                  alt="Bar Image"
                />
              </div>
              <div className="text-[18px] lg:text-[32px] text-white">
                {/* Fake Sober Taipei */}
                {booking[0]?.bar_name}
              </div>
              <div className="flex gap-2 text-[12px] lg:text-[16px] text-white">
                <p>
                  {/* 大安區 */}
                  {booking[0]?.bar_area_name}
                </p>
                <p>{booking[0]?.bar_type_name}</p>
              </div>
              <hr className="lg:w-[350px]" />

              {/* 表單內容 */}
              <form className="space-y-4" onSubmit={handleBookingSubmit}>
                <div className="text-[15px] lg:text-[20px] text-white">
                  選擇訂位時段
                </div>
                <div>
                  <label className="text-[15px] lg:text-[18px] text-white">
                    用餐人數
                  </label>
                  <br />
                  {/* <select className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2">
                    <option disabled selected>
                      選擇用餐人數
                    </option>
                    <option>1位</option>
                    <option>2位</option>
                    <option>3位</option>
                    <option>4位</option>
                    <option>5位</option>
                    <option>6位</option>
                  </select> */}
                  <select
                    className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2"
                    value={peopleNum}
                    onChange={(e) => setPeopleNum(e.target.value)}
                    required
                  >
                    <option disabled selected>
                      選擇用餐人數
                    </option>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num}位
                      </option>
                    ))}
                  </select>
                  <p className="text-[12px] text-white mt-1">
                    （可接受1-6位定位，超過8人請來電。）
                  </p>
                </div>
                <div>
                  <label className="text-[15px] lg:text-[18px] text-white">
                    預約日期
                  </label>
                  <br />
                  <input
                    className="w-full max-w-xs mt-2 input input-bordered input-sm"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[15px] lg:text-[18px] text-white">
                    預約時段
                  </label>
                  <br />
                  <div className="flex gap-4">
                    {/* 時段按鈕 */}
                    {/* <button
                      type="button"
                      className="text-white btn btn-outline btn-sm"
                    >
                      19:00
                    </button>
                    <button
                      type="button"
                      className="text-white btn btn-outline btn-sm"
                    >
                      20:00
                    </button>
                    <button
                      type="button"
                      className="text-white btn btn-outline btn-sm"
                    >
                      21:00
                    </button>
                    <button
                      type="button"
                      className="text-white btn btn-outline btn-sm"
                    >
                      22:00
                    </button> */}
                    {/* 時段按鈕 */}
                    {['19:00', '20:00', '21:00', '22:00'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`btn btn-outline btn-sm text-white ${
                          selectedTime === time ? 'bg-[#A0FF1F] text-black' : ''
                        }`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white">其他備註</label>
                  <br />
                  <textarea
                    className="w-full h-24 max-w-xs textarea textarea-bordered textarea-sm"
                    placeholder=""
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn w-[320px] bg-[#A0FF1F] text-black border-none rounded-[20px] hover:bg-[#A0FF1F]"
                >
                  確認訂位
                </button>
              </form>
            </div>
          </div>
          {/* 圖片區塊在大螢幕顯示，佔5列 */}
          <div className="hidden lg:block lg:col-span-4">
            <img
              className="w-[456px] h-[300px] object-cover rounded-[20px]"
              src={booking[0]?.bar_img}
              alt=""
            />
          </div>
        </div>
        {/* 右留 2/12 空白 */}
        <div className="w-1/12 md:w-2/12"></div>
      </div>
    </>
  );
}
