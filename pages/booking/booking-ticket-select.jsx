import React, { useState, useEffect } from 'react';
import { LuPopcorn } from 'react-icons/lu';
import { RiDrinks2Line } from 'react-icons/ri';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function MovieSeatSelection({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  // 假设这是您的电影座位数据
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [quantity, setQuantity] = useState(0); // 将数量初始化为0
  // 假设这是您的电影座位数据
  const [ticketQuantity, setTicketQuantity] = useState(0); // 電影票數量狀態
  const [ticketQuantitySec, setTicketQuantitySec] = useState(0); // 電影票數量狀態
  const [mealQuantity, setMealQuantity] = useState(0); // 配餐數量狀態
  const [mealQuantitySec, setMealQuantitySec] = useState(0); // 配餐數量狀態
  const [ticketAllQuantity, setticketAllQuantity] = useState(0); // 配餐數量狀態
  const [selectedTicketQuantity, setSelectedTicketQuantity] = useState(0); // 新增已选张数状态

  // 处理座位点击事件
  const handleSeatClick = (seatNumber) => {
    // 在这里可以编写逻辑来处理座位的选择和取消选择
    // 这个示例只是简单地将座位号添加到已选择的座位列表中，或从中移除
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // 数量加减的函数

  const handleTicketIncrement = () => {
    setTicketQuantity(ticketQuantity + 1);
    updateSelectedTicketQuantity(); // 更新已选张数
  };

  const handleTicketIncrementSec = () => {
    setTicketQuantitySec(ticketQuantitySec + 1);
    updateSelectedTicketQuantity(); // 更新已选张数
  };

  const handleTicketDecrement = () => {
    if (ticketQuantity > 0) {
      setTicketQuantity(ticketQuantity - 1);
      updateSelectedTicketQuantity(); // 更新已选张数
    }
  };

  const handleTicketDecrementSec = () => {
    if (ticketQuantitySec > 0) {
      setTicketQuantitySec(ticketQuantitySec - 1);
      updateSelectedTicketQuantity(); // 更新已选张数
    }
  };

  const handleMealIncrement = () => {
    setMealQuantity(mealQuantity + 1);
  };

  const handleMealIncrementSec = () => {
    setMealQuantitySec(mealQuantitySec + 1);
  };

  const handleMealDecrement = () => {
    if (mealQuantity > 0) {
      setMealQuantity(mealQuantity - 1);
    }
  };

  const handleMealDecrementSec = () => {
    if (mealQuantitySec > 0) {
      setMealQuantitySec(mealQuantitySec - 1);
    }
  };

  const handleTicketAllIncrement = () => {
    setticketAllQuantity(ticketAllQuantity + 1);
  };

  const handleTicketAllDecrement = () => {
    if (ticketAllQuantity > 0) {
      setticketAllQuantity(ticketAllQuantity - 1);
    }
  };

  const updateSelectedTicketQuantity = () => {
    setSelectedTicketQuantity(ticketQuantity + ticketQuantitySec); // 更新已选张数
    const totalTicketQuantity = ticketQuantity + ticketQuantitySec;
    setSelectedTicketQuantity(
      totalTicketQuantity > 0 ? totalTicketQuantity : 0
    ); // 更新已选张数，确保不小于零
  };

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex justify-between mx-5 pt-28">
        <div className="flex flex-col w-1/2 mr-5 h-full justify-center">
          <div
            className="card w-full bg-transparent shadow-xl mb-2"
            style={{ height: '50px' }}
          >
            <div className="card-body flex justify-center">
              <h2
                className="card-title"
                style={{
                  color: '#A0FF1F',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  margin: 0,
                }}
              >
                訂購座位數 <hr></hr> 1<hr></hr>
                <hr></hr>
                <hr></hr>
                <hr></hr>
                <hr></hr>
                <hr></hr>已選張數 <hr></hr>
                {selectedTicketQuantity}
              </h2>
            </div>
          </div>
          <div
            className="card w-full bg-transparent shadow-xl mb-2"
            style={{ height: '250px' }}
          >
            <div className="card-body">
              <h2 className="card-title" style={{ color: '#A0FF1F' }}>
                電影票
              </h2>
              <p>全票</p>
              <div className="flex items-center justify-end">
                <button
                  className="btn bg-transparent border border-gray-300 rounded-l-md px-3 py-1"
                  onClick={handleTicketDecrement}
                >
                  -
                </button>
                <span className="px-3 py-1 bg-gray-100 border border-gray-300 text-green-500">
                  {ticketQuantity}
                </span>
                <button
                  className="btn bg-transparent border border-gray-300 rounded-r-md px-3 py-1"
                  onClick={handleTicketIncrement}
                >
                  +
                </button>
              </div>
              <p>優待票</p>
              <div className="flex items-center justify-end">
                <button
                  className="btn bg-transparent border border-gray-300 rounded-l-md px-3 py-1"
                  onClick={handleTicketDecrementSec}
                >
                  -
                </button>
                <span className="px-3 py-1 bg-gray-100 border border-gray-300 text-green-500">
                  {ticketQuantitySec}
                </span>
                <button
                  className="btn bg-transparent border border-gray-300 rounded-r-md px-3 py-1"
                  onClick={handleTicketIncrementSec}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 配餐選擇 */}
          <div
            className="card w-full bg-transparent shadow-xl"
            style={{ height: '300px' }}
          >
            <div
              className="card-body flex justify-between"
              style={{ margin: '0 -10px' }}
            >
              <h2 className="card-title">配餐選擇</h2>
              <div className="flex justify-between">
                <div
                  className="card bg-transparent border border-white shadow-xl flex-grow flex-shrink"
                  style={{
                    maxWidth: '300px',
                    height: '230px',
                    width: '180px',
                    marginRight: '10px',
                    marginLeft: '10px',
                  }}
                >
                  <div className="flex justify-center text-[30px] px-10 pt-10">
                    {/* <img
                    src="	https://cdn.pixabay.com/photo/2022/09/01/17/15/popcorn-7425880_1280.png"
                    alt="Shoes"
                    className="rounded-xl"
                  /> */}
                    <LuPopcorn />
                    {/* <RiDrinksFill /> */}
                    <RiDrinks2Line />
                  </div>

                  <div className="card-body items-center text-center">
                    <h2 className="card-title">小可小爆</h2>
                    <div className="flex items-center justify-end">
                      <button
                        className="btn bg-transparent border border-gray-300 rounded-l-md px-3 py-1"
                        onClick={handleMealDecrement}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-100 border border-gray-300 text-green-500">
                        {mealQuantity}
                      </span>
                      <button
                        className="btn bg-transparent border border-gray-300 rounded-r-md px-3 py-1"
                        onClick={handleMealIncrement}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="card bg-transparent border border-white shadow-xl flex-grow flex-shrink"
                  style={{
                    maxWidth: '300px',
                    height: '230px',
                    width: '180px',
                    marginRight: '10px',
                    marginLeft: '10px',
                  }}
                >
                  <div className="flex justify-center text-[50px] px-10 pt-10">
                    {/* <img
                    src="	https://cdn.pixabay.com/photo/2022/09/01/17/15/popcorn-7425880_1280.png"
                    alt="Shoes"
                    className="rounded-xl"
                  /> */}
                    <LuPopcorn />
                    {/* <RiDrinksFill /> */}
                    <RiDrinks2Line />
                  </div>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">中可中爆</h2>
                    <div className="flex items-center justify-end">
                      <button
                        className="btn bg-transparent border border-gray-300 rounded-l-md px-3 py-1"
                        onClick={handleMealDecrementSec}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-100 border border-gray-300 text-green-500">
                        {mealQuantitySec}
                      </span>
                      <button
                        className="btn bg-transparent border border-gray-300 rounded-r-md px-3 py-1"
                        onClick={handleMealIncrementSec}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 訂單 */}
        <div className="w-1/2 p-4">
          <div
            className="card bg-transparent border border-neongreen shadow-xl relative"
            style={{ height: '605px' }}
          >
            <div className="flex ml-6 mt-8">
              <figure>
                <img
                  src="https://upload.wikimedia.org/wikipedia/zh/7/7a/Oppenheimer_%28film%29_poster.jpg"
                  alt="Shoes"
                  style={{ maxWidth: '150px', maxHeight: '150px' }}
                />
              </figure>
              <div className="card-body ml-2">
                <h2 className="card-title">奧本海默</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
              </div>
            </div>
            <div className="bottom-0 right-0 p-4">
              <div className="flex justify-end">
                <h2
                  className="card-title"
                  style={{
                    color: '#A0FF1F',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    margin: 0,
                  }}
                >
                  已選張數 <hr></hr>
                  {selectedTicketQuantity}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
