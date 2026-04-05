import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import MyTripDetailSidebar from '@/components/trip/sidebars/my-trip-detail-sidebar';
import TripNavigationTab from '@/components/trip/sidebars/trip-navigation-tab';
import ContentMorning from '@/components/trip/my-content/blocks/content-morning';
import ContentNoon from '@/components/trip/my-content/blocks/content-noon';
import ContentNight from '@/components/trip/my-content/blocks/content-night';
import BarPhotoCarousel from '@/components/trip/carousel/bar-photo-carousel';
import MoviePhotoCarousel from '@/components/trip/carousel/movie-photo-carousel';
import PageTitle from '@/components/page-title';
import PageLoader from '@/components/ui/loader/page-loader';
import { useTripDetail } from '@/hooks/trip/use-trip-detail';
import { useAuth } from '@/context/auth-context';
import Loader from '@/components/ui/loader/loader';
import MyTripDetailSection from '@/components/trip/my-content/my-trip-detail-section';

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
    setNewDetail,
    isLoading,
    refresh: refreshAllDetails,
  } = useTripDetail(trip_plan_id);

  const pageTitle = '行程規劃';
  useEffect(() => {
    onPageChange?.(pageTitle);
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
      <div className="flex flex-col min-h-screen bg-black">
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
          <div className="flex flex-col lg:flex-row justify-center items-start w-full max-w-[1700px] py-12 mx-auto px-6 sm:px-10 gap-12 lg:gap-20 transition-all duration-300 animate__animated animate__fadeIn">
            {/* 左側：酒吧輪播 */}
            <div className="hidden xl:flex w-[280px] justify-end flex-shrink-0 sticky top-32">
              <BarPhotoCarousel
                trip_plan_id={trip_plan_id}
                newDetail={newDetail}
                refreshAllDetails={refreshAllDetails}
              />
            </div>

            {/* 中間：時段內容 */}
            <div className="flex flex-col gap-16 w-full lg:flex-grow max-w-5xl">
              <ContentMorning
                newDetail={newDetail}
                setNewDetail={setNewDetail}
                tripDetails={tripDetails}
                trip_plan_id={trip_plan_id}
                refreshAllDetails={refreshAllDetails}
              />
              <ContentNoon
                newDetail={newDetail}
                setNewDetail={setNewDetail}
                tripDetails={tripDetails}
                trip_plan_id={trip_plan_id}
                refreshAllDetails={refreshAllDetails}
              />
              <ContentNight
                newDetail={newDetail}
                setNewDetail={setNewDetail}
                tripDetails={tripDetails}
                trip_plan_id={trip_plan_id}
                refreshAllDetails={refreshAllDetails}
              />
            </div>

            {/* 右側：行程細節編輯器 與 電影輪播 */}
            <div className="flex flex-col gap-12 w-full lg:w-[450px] flex-shrink-0">
              <MyTripDetailSection 
                tripName={tripName} 
                onUpdateSuccess={refreshAllDetails} 
              />
              
              <div className="hidden xl:flex justify-start">
                <MoviePhotoCarousel
                  trip_plan_id={trip_plan_id}
                  newDetail={newDetail}
                  refreshAllDetails={refreshAllDetails}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
