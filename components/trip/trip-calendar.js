import { useState, useEffect } from 'react';
import _ from 'lodash';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import { IoHeartCircleSharp, IoHeartCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import Router from 'next/router';
import Swal from 'sweetalert2';
import { apiClient } from '@/services/api-client';
import IndexLoader from '@/components/account-center/loader/index-loader';


function truncateChinese(title, maxChineseChars = 7) {
  let chineseCharCount = 0;
  let truncated = '';

  for (const char of title) {
    if (char.match(/[\u4e00-\u9fff]/)) {
      chineseCharCount += 1;
      if (chineseCharCount > maxChineseChars) {
        return truncated + '...';
      }
    }
    truncated += char;
  }

  return truncated;
}

export default function TripCalendar() {
  const { auth } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // console.log(getAuthHeader());

  useEffect(() => {
    if (auth.id === 0) return;
    fetchTrips();
  }, [auth.id]);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get('/trip/trip-plans');
      console.log('Fetched Trip Data:', data);
      setTrips(data || []);
    } catch (error) {
      console.error('Fetching trips error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tripDates = trips.map((trip) => {
    const date = new Date(trip.trip_date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份是從0開始，所以要 +1
    const day = date.getDate();
    return { year, month, day };
  });
  // console.log(tripDates);

  // 以 useState 控制 modal 的開關
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 開啟modal
  const openModal = () => setIsModalOpen(true);

  // 關閉modal
  const closeModal = () => setIsModalOpen(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalDate, setModalDate] = useState('');

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    const previousMonthDays = Array.from({ length: firstDay }, (_, i) => ({
      day: prevMonthTotalDays - firstDay + i + 1,
      isCurrentMonth: false,
    }));

    const thisMonthDays = Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const trip = trips.find((trip) => {
        const tripDate = new Date(trip.trip_date);
        return (
          tripDate.getFullYear() === year &&
          tripDate.getMonth() === month &&
          tripDate.getDate() === day
        );
      });
      return {
        day,
        isCurrentMonth: true,
        trip: trip || null,
      };
    });

    const totalCells = 42;
    const filledCells = previousMonthDays.length + thisMonthDays.length;
    const cellsToAdd = totalCells - filledCells;
    const nextMonthDays = Array.from({ length: cellsToAdd }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: false,
      trip: null,
    }));

    const allDays = [
      ...Array(firstDay).fill({ day: null, isCurrentMonth: false, trip: null }),
      ...thisMonthDays,
      ...nextMonthDays,
    ];

    return _.chunk(allDays, 7).map((week, weekIndex) => (
      <tr key={weekIndex}>
        {week.map((cell, dayIndex) => (
          <td
            key={dayIndex}
            style={{ verticalAlign: 'top' }}
            className={`text-sm sm:text:base h-12 sm:w-60 sm:h-28 text-center border border-white ${
              cell.isCurrentMonth
                ? 'text-white bg-black cursor-pointer'
                : 'text-gray-500 bg-black'
            }`}
            onClick={() => {
              if (cell.isCurrentMonth && !cell.trip) {
                //只有當前月份 "且" 不包含行程的td可以透過點擊觸發彈跳視窗
                handleDayClick(cell.day);
              }
            }}
          >
            {cell.day}
            {cell.trip && (
              <div className="sm:mt-3 flex justify-center items-center">
                <Link
                  href={`/trip/my-trip/detail/${cell.trip.trip_plan_id}`}
                  className=" hidden sm:inline-block text-sm sm:mt-3 sm:text-2xl bg-black px-3 py-2 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-white tooltip"
                  data-tip={cell.trip.trip_title}
                >
                  {truncateChinese(cell.trip.trip_title)}
                </Link>
                <Link
                  href={`/trip/my-trip/detail/${cell.trip.trip_plan_id}`}
                  className="block sm:hidden text-white text-lg "
                >
                  <IoHeartCircleOutline className=" text-[#ff03ff] hover:text-[#a0ff1f]" />
                </Link>
              </div>
            )}
          </td>
        ))}
      </tr>
    ));
  };

  const handleDayClick = (day) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    setSelectedDate(selected);

    // 取得td的日期
    const year = selected.getFullYear();
    const month = selected.getMonth() + 1; // getMonth() 返回的月份是從0開始的
    const dayOfMonth = selected.getDate();
    const formattedDate = `${year}-${month
      .toString()
      .padStart(2, '0')}-${dayOfMonth.toString().padStart(2, '0')}`; //padStart(2, '0')可以確保月份是二位數

    setModalDate(formattedDate); // 更新彈跳窗口內的日期

    setIsModalOpen(true); // Open the modal dialog
  };
  //控制表單的狀態
  const [tripTitle, setTripTitle] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // 建立完整承載，補齊所有可能的資料庫欄位，避免 NOT NULL 約束衝突
      const fullPayload = {
        user_id: auth.id,
        trip_date: modalDate,
        trip_title: tripTitle,
        trip_content: '',
        trip_notes: '',
        trip_description: '',
        trip_pic: null,
        trip_draft: 0
      };

      console.log('Attempting trip creation with full payload:', fullPayload);

      let data;
      try {
        // 根據您的分析，後端目前直接將 req.body 丟給 Service，因此我們預設發送 FLAT 結構
        data = await apiClient.post('/trip/trip-plans/add', fullPayload);
        
        // 重要：如果後端回傳 200 但 success 為 false，手動切換到 nested 嘗試
        if (data && data.success === false) {
           console.warn('Flat payload failed with success:false, retrying with Nested wrapper...');
           data = await apiClient.post('/trip/trip-plans/add', {
             tripPlan: fullPayload
           });
        }
      } catch (e) {
        console.warn('First attempt failed with error, retrying with Nested payload...', e);
        data = await apiClient.post('/trip/trip-plans/add', {
          tripPlan: fullPayload
        });
      }

      console.log('Final Backend Response:', data);

      if (data && (data.success !== false && data.success !== 'false')) {
        console.log('Trip plan created successfully:', data);
        closeModal();

        const newTripPlanId = data.tripPlanId || data.insertId || data.id;
        const flatData = await apiClient.post('/trip/trip-plans/add', payload);
        if (flatData.success !== false) {
            closeModal();
            const flatId = flatData.tripPlanId || flatData.insertId || flatData.id;
            Router.push(`/trip/my-trip/detail/${flatId}`);
        } else {
            throw new Error(flatData.message || flatData.error || '新增資料到資料庫時出錯');
        }
      }
    } catch (error) {
      console.error('Creating trip plan error:', error);
      Swal.fire({
        icon: 'error',
        title: '新增失敗',
        text: error.message || '連線錯誤或資料結構不符',
        background: '#2a303c',
        color: '#ffffff',
        confirmButtonColor: '#a0ff1f',
        customClass: {
          confirmButton: 'text-black font-bold border-none px-6 py-2',
          popup: 'border-2 border-[#a0ff1f] rounded-box shadow-[0_0_20px_rgba(160,255,31,0.3)]'
        }
      });
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center bg-black">
        <IndexLoader />
      </div>
    );
  }

  return (

    <>
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center bg-black mb-5">
        <div className="flex justify-center items-center gap-12 sm:mb-10 mb-2 mt-2">
          <button
            className="text-3xl sm:text-5xl hover:text-[#a0ff1f]"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
              )
            }
          >
            <FaArrowAltCircleLeft />
          </button>
          <p className="text-2xl sm:text-4xl">
            {`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`}
          </p>
          <button
            className="text-3xl sm:text-5xl hover:text-[#a0ff1f]"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
              )
            }
          >
            <FaArrowAltCircleRight />
          </button>
        </div>
        <table className="table-auto">
          <thead>
            <tr>
              {weekDays.map((day, i) => (
                <th
                  key={i}
                  className="w-12 sm:w-48 sm:h-8 text-center text-black bg-white first:rounded-tl-lg last:rounded-tr-lg"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendarDays()}</tbody>
        </table>
      </div>
      {isModalOpen && (
        <dialog open id="my_modal_1" className="modal">
          <form onSubmit={handleSubmit}>
            <div className="modal-box w-96">
              <h3 className="font-bold text-lg mb-4 text-white">建立行程</h3>
              <p className="text-white">行程日期</p>
              <input
                type="trip_date"
                className="mt-4 mb-4 px-2 py-1 w-full"
                value={modalDate}
                readOnly
              />
              <p className="text-white">行程名稱</p>
              <input
                type="text"
                className="mt-4 mb-4 px-2 py-1 w-full text-black"
                value={tripTitle}
                onChange={(event) => setTripTitle(event.target.value)}
                placeholder="請輸入行程名稱"
                required
              />
              <div className="modal-action">
                {/* 更新按鈕的onClick處理函式，以關閉彈出視窗 */}
                <button
                  type="button"
                  className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                  onClick={closeModal}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                >
                  完成
                </button>
              </div>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
