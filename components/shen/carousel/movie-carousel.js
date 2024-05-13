import React, { useState, useEffect } from 'react';
import MoviePhotoCarousel from './movie-photo-carousel';

export default function MovieCarousel({ trip_plan_id }) {
  const photoCount = 10; // 假設有10張照片
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false); // 新增狀態來追蹤滑鼠懸停狀態

  useEffect(() => {
    // 當isHovering為true時停止輪播
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photoCount);
      }, 5000); // 每5秒切換一次內容，注釋有誤

      return () => clearInterval(interval);
    }
  }, [isHovering, photoCount]); // 依賴列表中添加isHovering

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <MoviePhotoCarousel
        trip_plan_id={trip_plan_id}
        currentIndex={currentIndex}
      />
    </div>
  );
}
