import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import { IoHeartCircleSharp, IoHeartCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import Router from 'next/router';

export default function TripCalendarModal({ tripName }) {
  const { auth, getAuthHeader } = useAuth();
  const [trips, setTrips] = useState([]);

  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:3001/trip/trip-plans', {
        headers: { ...getAuthHeader() },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched Trip Data:', data);
      setTrips(data);
    } catch (error) {
      console.error('Fetching trips error:', error);
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
            className={`text-sm sm:text:base h-12 sm:w-48 sm:h-20 text-center border border-white ${
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
                  className="hidden sm:inline-block text-sm bg-black px-2 py-1 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-white"
                >
                  {cell.trip.trip_title}
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
      day
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
    // console.log('tripDate:', tripDate);
    // console.log('tripTitle:', tripTitle);
    try {
      const response = await fetch(
        'http://localhost:3001/trip/trip-plans/add',
        {
          method: 'POST',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: auth.id,
            trip_date: modalDate,
            trip_title: tripTitle,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Network response was not ok');
      }
      console.log('Trip plan created successfully:', data);
      closeModal();

      const newTripPlanId = data.tripPlanId;
      console.log(newTripPlanId);
      const newPath = `/trip/my-trip/detail/${newTripPlanId}`;
      Router.push(newPath);
    } catch (error) {
      console.error('Creating trip plan error:', error);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center bg-black mb-5">
        <div className="flex justify-center items-center gap-12 mb-2 mt-2">
          <button
            className="text-3xl hover:text-[#a0ff1f]"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
              )
            }
          >
            <FaArrowAltCircleLeft />
          </button>
          <p className="text-2xl">
            {`${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`}
          </p>
          <button
            className="text-3xl hover:text-[#a0ff1f]"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
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
                className="mt-4 mb-4 px-2 py-1 w-full"
                value={tripTitle}
                onChange={(event) => setTripTitle(event.target.value)}
                placeholder="請輸入行程名稱"
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
