import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


function Popup({ movie, time, date, onClose }) {


  return (
    <div className="popup">
      <div className="popup-content">
        <h2>確認訂票</h2>
        <p>您選擇的電影：{movie}</p>
        <p>時間：{time}</p>
        <p>日期：{date}</p>
        <button onClick={onClose}>關閉</button>
      </div>
    </div>
  );
}

export default function MyComponent({ onPageChange }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleConfirm = () => {
    // 在這裡處理確認訂票的邏輯
    // 例如，發送訂票請求等
    // 這只是一個示例，你可以根據自己的需求進行調整
    alert('訂票成功！');
    setShowPopup(false);
  };

  return (
    <>
      <div>
        {/* 顯示彈跳視窗的按鈕 */}
        <button onClick={() => setShowPopup(true)}>顯示彈跳視窗</button>

        {/* 彈跳視窗 */}
        {showPopup && (
          <Popup
            movie={selectedMovie}
            time={selectedTime}
            date={selectedDate}
            onClose={() => setShowPopup(false)}
          />
        )}

        {/* 這裡可以是你的電影選擇和日期時間選擇的組件 */}
        {/* 在選擇完畢後，更新 selectedMovie、selectedTime 和 selectedDate 的狀態 */}
        {/* 然後點擊確認訂票按鈕後調用 handleConfirm 函數 */}
      </div>
    </>
  );
}
