import { useState, useEffect } from 'react';
import MovieTicketCard from '@/components/booking/card/movieTicketCard';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import { BookingService } from '@/services/booking-service';

export default function Index({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const [movieCards, setMovieCards] = useState([]);

  const getBookingSystemMovieCard = async () => {
    try {
      const data = await BookingService.getBookingSystem();
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
