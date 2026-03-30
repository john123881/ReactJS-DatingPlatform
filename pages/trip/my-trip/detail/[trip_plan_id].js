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


export default function MyTripDetail({ onPageChange }) {
  const router = useRouter();

  const { trip_plan_id } = router.query;
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




  //TODO
  //讀取trip_calendar的資料，並根據 trip_plan_id 獲取行程詳情

  //TODO
  //根據時段是否有行程決定顯示的內容
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <PageLoader type="index" />
      </div>
    );
  }

  return (

    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-col min-h-screen">
        <TripNavigationTab showTitle={false} />
        <MyTripDetailSidebar
          tripName={tripName}
          refreshTripDetails={refreshAllDetails}
        />

        <div className="flex justify-start items-start w-full max-w-7xl py-8 overflow-x-hidden mx-auto px-6 sm:px-20 gap-8 lg:gap-16 animate__animated animate__fadeIn">
          <div className="hidden lg:flex w-[250px] justify-end flex-shrink-0">
            <BarPhotoCarousel
              trip_plan_id={trip_plan_id}
              refreshAllDetails={refreshAllDetails}
            />
          </div>
          <div className="mt-8 mb-8 flex flex-col justify-center items-center gap-12 w-full max-w-4xl px-4">
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
              refreshAllDetails={refreshAllDetails}
            />
          </div>
        </div>
      </div>
    </>
  );
}
