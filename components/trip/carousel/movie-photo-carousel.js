import { useState, useEffect } from 'react';
import CarouselContentMovie from './carousel-content-movie';
import { TripService } from '@/services/trip-service';

export default function MoviePhotoCarousel({
  trip_plan_id,
  refreshAllDetails,
  newDetail
}) {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const displayCount = 3; // 每次顯示3張海報
  const photoCount = 10; // 假設總共有10張海報，這個應根據實際獲取的數據調整

  useEffect(() => {
    // refreshAllDetails is used by child components
  }, [refreshAllDetails]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await TripService.getRecommendMovies();
        setMovies(data);
      } catch (error) {
        console.error('Fetching Movie recommendation error:', error);
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
        Math.max(0, displayCount - (movies.length - currentIndex)),
      ),
    );

  return (
    <div
      className="hidden sm:flex sm:flex-col gap-6 mb-8"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h3 className="text-center text-2xl">熱門電影</h3>
      {currentMovies.map((movie, index) => (
        <CarouselContentMovie
          key={movie.movie_id || index}
          movies={movie}
          trip_plan_id={trip_plan_id}
          newDetail={newDetail}
          refreshAllDetails={refreshAllDetails}
        />
      ))}
    </div>
  );
}
