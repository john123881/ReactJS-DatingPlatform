import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BookingConfirmModal from '@/components/bar/modal/booking-confirm-modal';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function BarBooking({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const currentPage = '訂位';
  const BookingConfirmModal = dynamic(
    () => import('@/components/bar/modal/booking-confirm-modal'),
    { ssr: false }
  );
  const [selectedTime, setSelectedTime] = useState('');

  // Handler to set the selected time
  const handleTimeSelect = (time) => {
    setSelectedTime(time); // Update the selected time state
  };
  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-row justify-center gap-4 pt-20">
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
                  src="https://damei17.com/wp-content/uploads/2022/08/Fake-Sober-24.jpg"
                  alt="Bar Image"
                />
              </div>
              <div className="text-[18px] lg:text-[32px] text-white">
                Fake Sober Taipei
              </div>
              <div className="flex gap-2 text-[12px] lg:text-[16px] text-white">
                <p>大安區</p>
                <p>特色酒吧</p>
              </div>
              <hr className="lg:w-[350px]" />

              {/* 表單內容 */}
              <form className="space-y-4">
                <div className="text-[15px] lg:text-[20px] text-white">
                  選擇訂位時段
                </div>
                <div>
                  <label className="text-[15px] lg:text-[18px] text-white">
                    用餐人數
                  </label>
                  <br />
                  <select className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2">
                    <option disabled selected>
                      選擇用餐人數
                    </option>
                    <option>1位</option>
                    <option>2位</option>
                    <option>3位</option>
                    <option>4位</option>
                    <option>5位</option>
                    <option>6位</option>
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
                    type="date"
                    className="w-full max-w-xs mt-2 input input-bordered input-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[15px] lg:text-[18px] text-white">
                    預約時段
                  </label>
                  <br />
                  <div className="flex gap-4">
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
                <div
                  type="submit"
                  className="btn w-[320px] bg-[#A0FF1F] text-black border-none rounded-[20px] hover:bg-[#A0FF1F]"
                  onClick={() =>
                    document.getElementById('booking-confirm-modal').showModal()
                  }
                >
                  <span className="text-black text-h6">確認訂位</span>
                  <BookingConfirmModal />
                </div>
              </form>
            </div>
          </div>
          {/* 圖片區塊在大螢幕顯示，佔5列 */}
          <div className="hidden lg:block lg:col-span-4">
            <img
              className="w-[456px] h-[300px] object-cover rounded-[20px]"
              src="https://damei17.com/wp-content/uploads/2022/08/Fake-Sober-24.jpg"
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
