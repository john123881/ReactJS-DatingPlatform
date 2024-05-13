import React, { useState, useEffect } from 'react';
import BarPhotoCarousel from './bar-photo-carousel';

export default function BarCarousel({ trip_plan_id }) {
  const photoCount = 10; // 假設有10張照片
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photoCount);
      }, 5000); // 每5秒切換一次內容
      return () => clearInterval(interval);
    }
  }, [isHovering, photoCount]);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h3 className="text-center">熱門酒吧</h3>
      <BarPhotoCarousel
        trip_plan_id={trip_plan_id}
        currentIndex={currentIndex}
      />
    </div>
  );
}
