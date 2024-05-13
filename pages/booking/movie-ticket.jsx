import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import MovieTicketCard from '@/components/booking/card/movieTicketCard';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function Index({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const [isHovered1, setIsHovered1] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [movieCards, setMovieCards] = useState([]);

  const getBookingSystemMovieCard = async () => {
    try {
      const res = await fetch(
        'http://localhost:3001/booking/get-booking-system'
      );
      const data = await res.json();
      setMovieCards(data);
    } catch (error) {
      console.log('Failed to fetch movie card', error);
    }
  };

  useEffect(() => {
    getBookingSystemMovieCard();
  }, []);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex justify-between flex-wrap  spcae-x-0 space-y-0 gap-5 pt-20">
        {movieCards.map((movie, index) => (
          <MovieTicketCard movie={movie} key={index} />
        ))}
      </div>
    </>
  );
}
