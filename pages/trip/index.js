import TripNavigationTab from '../../components/trip/sidebars/trip-navigation-tab';
import TripCalendar from '@/components/trip/trip-calendar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import { useAuth } from '@/context/auth-context';
import Loader from '@/components/ui/loader/loader';

export default function Calendar({ onPageChange }) {
  const pageTitle = '行程規劃';
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

  if (!isAuthLoaded) {
    return <Loader text="確認登入狀態中..." minHeight="80vh" />;
  }

  if (auth.id === 0) {
    return null; // 正在跳轉中
  }

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <TripNavigationTab />
      <TripCalendar />
    </>
  );
}
