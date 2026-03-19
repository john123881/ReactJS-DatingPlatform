import TripSidebar from '../../components/shen/sidebars/trip-sidebar';
import TripCalendar from '@/components/shen/trip-calendar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function Calendar({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <TripSidebar />
      <TripCalendar />
    </>
  );
}
