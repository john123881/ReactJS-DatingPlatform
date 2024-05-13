import React, { useState, useEffect } from 'react';
import CarouselContentMovie2 from './carousel-content-movie2';

export default function MoviePhotoCarousel2({
  trip_plan_id,
  refreshAllDetails,
}) {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const displayCount = 3; // 每次顯示3張海報
  const photoCount = 10; // 假設總共有10張海報，這個應根據實際獲取的數據調整

  useEffect(() => {
    console.log('refreshAllDetails in MoviePhotoCarousel:', refreshAllDetails);
  }, [refreshAllDetails]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/trip/my-details/recommend/movie'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setMovies(data);
      } catch (error) {
        console.error('Fetching Bar saved error:', error);
      }
    };
    fetchMovie();
  }, []);

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photoCount);
      }, 5000); // 每5秒自動切換一次
      return () => clearInterval(interval);
    }
  }, [isHovering, photoCount]);

  const currentMovies = movies
    .slice(currentIndex, currentIndex + displayCount)
    .concat(
      movies.slice(
        0,
        Math.max(0, displayCount - (movies.length - currentIndex))
      )
    );

  return (
    <div
      className="hidden sm:flex sm:flex-col gap-6 mb-8"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h3 className="text-center text-2xl">熱門電影</h3>
      {currentMovies.map((movies, index) => (
        <CarouselContentMovie2
          key={index}
          movies={movies}
          trip_plan_id={trip_plan_id}
          refreshAllDetails={refreshAllDetails}
        />
      ))}
    </div>
  );
}
