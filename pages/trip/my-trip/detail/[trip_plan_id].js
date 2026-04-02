import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import MyTripDetailSidebar from '@/components/trip/sidebars/my-trip-detail-sidebar';
import TripNavigationTab from '@/components/trip/sidebars/trip-navigation-tab';
import ContentMorning from '@/components/trip/my-content/blocks/content-morning';
import ContentNoon from '@/components/trip/my-content/blocks/content-noon';
import ContentNight from '@/components/trip/my-content/blocks/content-night';
import BarPhotoCarousel from '@/components/trip/carousel/bar-photo-carousel';
import MoviePhotoCarousel2 from '@/components/trip/carousel/movie-photo-carousel2';
import PageTitle from '@/components/page-title';
import PageLoader from '@/components/ui/loader/page-loader';
import { useTripDetail } from '@/hooks/trip/use-trip-detail';
import { useAuth } from '@/context/auth-context';
import Loader from '@/components/ui/loader/loader';

export default function MyTripDetail({ onPageChange }) {
  const router = useRouter();
  const { auth, isAuthLoaded, setLoginModalToggle } = useAuth();
  const { trip_plan_id } = router.query;

  // Auth Guard
  useEffect(() => {
    if (isAuthLoaded && auth.id === 0) {
      setLoginModalToggle(true);
    }
  }, [isAuthLoaded, auth.id, setLoginModalToggle]);

  const {
    tripDetails,
    tripName,
    newDetail,
    isLoading,
    refresh: refreshAllDetails,
  } = useTripDetail(trip_plan_id);

  const pageTitle = '行程規劃';
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  useEffect(() => {
    if (trip_plan_id === 'undefined') {
      router.replace('/trip/my-trip');
    }
  }, [trip_plan_id, router]);

  if (!isAuthLoaded) {
    return <Loader text="確認登入狀態中..." minHeight="80vh" />;
  }

  if (auth.id === 0) {
    return null;
  }

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-col min-h-screen">
        <TripNavigationTab />
        <MyTripDetailSidebar
          tripName={tripName}
          refreshTripDetails={refreshAllDetails}
        />

        {isLoading ? (
          <div className="flex flex-col flex-grow justify-center items-center h-[600px] animate__animated animate__fadeIn">
            <PageLoader type="index" />
            <p className="mt-4 text-white/50 text-xl">正在準備您的行程細節...</p>
          </div>
        ) : (
          <div className="flex justify-center items-start w-full max-w-[1600px] py-8 overflow-x-hidden mx-auto px-6 sm:px-10 gap-8 lg:gap-16 animate__animated animate__fadeIn">
            <div className="hidden lg:flex w-[250px] justify-end flex-shrink-0">
              <BarPhotoCarousel
                trip_plan_id={trip_plan_id}
                newDetail={newDetail}
                refreshAllDetails={refreshAllDetails}
              />
            </div>
            <div className="mt-8 mb-8 flex flex-col justify-center items-center gap-12 w-[896px] px-4 flex-shrink-0">
              <ContentMorning
                newDetail={newDetail}
                tripDetails={tripDetails}
                trip_plan_id={trip_plan_id}
              />
              <ContentNoon
                newDetail={newDetail}
                tripDetails={tripDetails}
                trip_plan_id={trip_plan_id}
              />
              <ContentNight
                newDetail={newDetail}
                tripDetails={tripDetails}
                trip_plan_id={trip_plan_id}
              />
            </div>
            <div className="hidden lg:flex w-[250px] justify-start flex-shrink-0">
              <MoviePhotoCarousel2
                trip_plan_id={trip_plan_id}
                newDetail={newDetail}
                refreshAllDetails={refreshAllDetails}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
