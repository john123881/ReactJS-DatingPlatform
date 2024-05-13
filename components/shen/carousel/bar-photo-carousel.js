import React, { useState, useEffect } from 'react';
import CarouselContentBar from './carousel-content-bar';

export default function BarPhotoCarousel({ trip_plan_id, refreshAllDetails }) {
  const [barSaved, setBarSaved] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const displayCount = 3; // 每次顯示3張照片
  const photoCount = 10; // 假設總共有10張照片，這個應根據實際獲取的數據調整

  useEffect(() => {
    const fetchBarSaved = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/trip/my-details/recommend/bar'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBarSaved(data);
      } catch (error) {
        console.error('Fetching Bar saved error:', error);
      }
    };
    fetchBarSaved();
  }, []);

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photoCount);
      }, 5000); // 每5秒自動切換一次
      return () => clearInterval(interval);
    }
  }, [isHovering, photoCount]);

  const currentBars = barSaved
    .slice(currentIndex, currentIndex + displayCount)
    .concat(
      barSaved.slice(
        0,
        Math.max(0, displayCount - (barSaved.length - currentIndex))
      )
    );

  return (
    <div
      className="hidden sm:flex sm:flex-col gap-6 mb-8"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h3 className="text-center text-2xl">熱門酒吧</h3>
      {currentBars.map((bar, index) => (
        <CarouselContentBar
          key={index}
          barSaved={bar}
          altText={bar.bar_name}
          trip_plan_id={trip_plan_id}
          refreshAllDetails={refreshAllDetails}
        />
      ))}
    </div>
  );
}
