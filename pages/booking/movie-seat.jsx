import React, { useState, useEffect } from 'react';
import { FaCircle } from 'react-icons/fa'; // 导入 Font Awesome 的圆圈图标
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

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="card w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center text-center">
          <h2 className="card-title">片名</h2>
          <p>奧本海默</p>
          <div className="card-actions justify-end"></div>
        </div>
      </div>

      <div className="movie-seat-selection">
        {/* <h1>电影选择位置</h1> */}
        <div className="seat-map">
          {/* 创建座位图 */}
          {Array.from({ length: 10 }, (_, row) => (
            <div key={row} className="seat-row cursor-pointer">
              {Array.from({ length: 21 }, (_, col) => {
                const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
                const isSelected = selectedSeats.includes(seatNumber);
                return (
                  <div
                    key={col}
                    className={`seat ${
                      isSelected ? 'selected' : ''
                    } cursor-pointer hover:text-neonpink`}
                    style={{ display: 'inline-block', margin: '5px' }}
                    onClick={() => handleSeatClick(seatNumber)}
                  >
                    <FaCircle style={{ fontSize: '20px' }} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="selected-seats">
          <p>已选择的座位：</p>
          <ul>
            {selectedSeats.map((seat, index) => (
              <li key={index}>{seat}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        className="btn btn-outline"
        style={{
          textAlign: 'center',
          margin: '0 10px', // 設置按鈕之間的間距
          display: 'inline-block',
          height: '50px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s',
          color: '#A0FF1F',
          borderColor: '#A0FF1F',
        }}
        onClick={() =>
          (window.location.href = '../../../booking/booking-confirm')
        }
      >
        座位確認
      </button>
    </>
  );
}
