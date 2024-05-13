import React, { useState, useEffect } from 'react';
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
      <div className="card w-96 bg-neutral text-neutral-content items-center">
        <div className="card-body items-center text-center">
          <h2 className="card-title">訂票同意</h2>
          <p>訂票同意書</p>
        </div>
      </div>
      {/* <div className="form-control">
  <label className="cursor-pointer label">
    <span className="label-text">同意請勾選</span>
    <input type="checkbox" defaultChecked className="checkbox checkbox-success" />
  </label>
</div> */}
      <div className="flex justify-center items-center h-screen">
        <div className="form-control">
          <label className="cursor-pointer label flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="checkbox checkbox-success mr-2"
              style={{ borderColor: '#10b981', backgroundColor: '#10b981' }}
            />
            <span className="label-text">同意請勾選</span>
          </label>
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
          (window.location.href = '../../../booking/booking-ticket-select')
        }
      >
        我已同意，前往票卷選擇
      </button>
    </>
  );
}
