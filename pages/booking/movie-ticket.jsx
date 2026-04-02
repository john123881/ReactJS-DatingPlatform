import { useState, useEffect } from 'react';
import MovieTicketCard from '@/components/booking/card/movieTicketCard';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import { BookingService } from '@/services/booking-service';
import { useAuth } from '@/context/auth-context';
import Loader from '@/components/ui/loader/loader';

export default function Index({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  const { auth, isAuthLoaded, setLoginModalToggle } = useAuth();

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  // Auth Guard
  useEffect(() => {
    if (isAuthLoaded && auth.id === 0) {
      setLoginModalToggle(true);
    }
  }, [isAuthLoaded, auth.id, setLoginModalToggle]);

  const [movieCards, setMovieCards] = useState([]);

  const getBookingSystemMovieCard = async () => {
    try {
      const data = await BookingService.getBookingSystem();
      setMovieCards(data);
    } catch (error) {
      console.error('Failed to fetch movie card', error);
    }
  };

  useEffect(() => {
    if (auth.id === 0) return;
    getBookingSystemMovieCard();
  }, [auth.id]);

  if (!isAuthLoaded) {
    return <Loader text="確認登入狀態中..." minHeight="80vh" />;
  }

  if (auth.id === 0) {
    return null;
  }

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
