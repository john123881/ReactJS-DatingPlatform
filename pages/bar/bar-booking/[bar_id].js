import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import Image from 'next/image';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import PageTitle from '@/components/page-title';
import { BarService } from '@/services/bar-service';
import Loader from '@/components/ui/loader/loader';

export default function Booking({ onPageChange }) {
  const pageTitle = '酒吧訂位';
  const router = useRouter();
  const { auth } = useAuth();

  const { bar_id } = router.query;

  // 使用 SWR 抓取酒吧詳情
  const { data: bar, error, isLoading } = useSWR(
    router.isReady && bar_id ? ['bar-detail', bar_id] : null,
    () => BarService.getBarDetail(bar_id),
    { revalidateOnFocus: false }
  );

  const currentPage = bar?.bar_name;

  const [selectedTime, setSelectedTime] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [peopleNum, setPeopleNum] = useState('');

  const timeSlotMapping = {
    '19:00': 1,
    '20:00': 2,
    '21:00': 3,
    '22:00': 4,
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (!bookingDate || !peopleNum || !selectedTime) {
      alert('請完整填寫訂位資訊');
      return;
    }

    const bookingData = {
      user_id: auth.id,
      bar_id: bar?.bar_id,
      bar_booking_time: `${bookingDate}`,
      bar_booking_people_num: peopleNum,
      bar_time_slot_id: timeSlotMapping[selectedTime],
    };

    try {
      const result = await BarService.createBooking(bookingData);
      
      if (result.success) {
        toast.success('訂位成功!');
      }
    } catch (error) {
      console.error('訂位失敗:', error);
      toast.error('訂位失敗!', error.message);
    }
  };

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  if (error) return <div className="pt-28 text-center text-white text-h3">載入失敗，請稍後再試</div>;

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-row justify-center gap-4 pt-20 h-screen">
        <div className="w-1/12 md:w-2/12"></div>

        <div className="w-10/12 gap-4 md:w-8/12 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-12">
            <div className="text-sm breadcrumbs">
               <Breadcrumbs currentPage={currentPage} />
            </div>
          </div>

          {isLoading || !bar ? (
            <div className="lg:col-span-12">
              <Loader minHeight="100vh" text="正在為您預留座位..." />
            </div>
          ) : (
            <>
              <div className="lg:col-span-5 space-y-2">
                <div className="text-white text-[18px]">我要訂位</div>
                <div className="lg:hidden">
                  <Image
                    className="w-[340px] h-[130px] object-cover rounded-[20px]"
                    src={bar?.bar_pic_name ? `/barPic/${bar.bar_pic_name}` : '/unavailable-image.jpg'}
                    alt="Bar Image"
                    width={340}
                    height={130}
                  />
                </div>
                <div className="text-[18px] lg:text-[32px] text-white">
                  {bar?.bar_name}
                </div>
                <div className="flex gap-2 text-[12px] lg:text-[16px] text-white">
                  <p>{bar?.bar_area_name}</p>
                  <p>{bar?.bar_type_name}</p>
                </div>
                <hr className="lg:w-[350px]" />

                <form className="space-y-4" onSubmit={handleBookingSubmit}>
                  <div className="text-[15px] lg:text-[20px] text-white">
                    選擇訂位時段
                  </div>
                  <div>
                    <label className="text-[15px] lg:text-[18px] text-white">
                      用餐人數
                    </label>
                    <br />
                    <select
                      className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2 bg-black text-white"
                      value={peopleNum}
                      onChange={(e) => setPeopleNum(e.target.value)}
                      required
                    >
                      <option value="" disabled>
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
                      className="w-full max-w-xs mt-2 input input-bordered input-sm bg-black text-white"
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
                      {['19:00', '20:00', '21:00', '22:00'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={`btn btn-outline btn-sm text-white ${
                            selectedTime === time ? 'bg-[#A0FF1F] text-black border-[#A0FF1F]' : ''
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
                      className="w-full h-24 max-w-xs textarea textarea-bordered textarea-sm bg-black text-white"
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
              <div className="hidden lg:block lg:col-span-4 lg:ml-10">
                <Image
                  className="w-[456px] h-[300px] object-cover rounded-[20px]"
                  src={bar?.bar_pic_name ? `/barPic/${bar.bar_pic_name}` : '/unavailable-image.jpg'}
                  alt=""
                  width={456}
                  height={300}
                />
              </div>
            </>
          )}
        </div>
        <div className="w-1/12 md:w-2/12"></div>
      </div>
    </>
  );
}
