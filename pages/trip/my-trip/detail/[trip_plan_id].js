import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import TripSidebar2 from '@/components/trip/sidebars/trip-sidebar2';
import ContentMorning from '@/components/trip/my-content/blocks/contentMorning';
import ContentNoon from '@/components/trip/my-content/blocks/contentNoon';
import ContentNight from '@/components/trip/my-content/blocks/contentNight';
import BarPhotoCarousel from '@/components/trip/carousel/bar-photo-carousel';
import MoviePhotoCarousel2 from '@/components/trip/carousel/movie-photo-carousel2';
import PageTitle from '@/components/page-title';
import { apiClient } from '@/services/api-client';
import AccountLoader from '@/components/account-center/loader/account-loader';


export default function MyTripDetail({ onPageChange }) {
  const router = useRouter();

  const { trip_plan_id } = router.query;
  const [tripDetails, setTripDetails] = useState({}); //用於儲存從trip_calendar中獲獲取的值
  const [tripName, setTripName] = useState({}); //用於儲存從trip_plans中獲獲取的值
  const [newDetail, setNewDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const pageTitle = '行程規劃';
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  useEffect(() => {
    if (trip_plan_id === 'undefined') {
      router.replace('/trip/my-trip');
    }
  }, [trip_plan_id, router]);

  // 整合資料獲取
  useEffect(() => {
    if (!trip_plan_id || trip_plan_id === 'undefined') return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [detailsData, nameData, allDayData] = await Promise.all([
          apiClient.get(`/trip/my-details/${trip_plan_id}`),
          apiClient.get(`/trip/my-details/trip-plan/${trip_plan_id}`),
          apiClient.get(`/trip/my-details/allday-content/${trip_plan_id}`)
        ]);

        if (detailsData && detailsData.length > 0) {
          setTripDetails(detailsData[0]);
        }
        
        if (nameData) {
          setTripName(nameData);
        }

        if (allDayData && allDayData.length > 0) {
          setNewDetail(allDayData);
        } else {
          setNewDetail({ block: null });
        }
      } catch (error) {
        console.error('Fetching trip detail data error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [trip_plan_id]);

  // 為子元件保留的刷新函數
  const refreshAllDetails = useCallback(async () => {
    if (!trip_plan_id) return;
    try {
      const data = await apiClient.get(`/trip/my-details/allday-content/${trip_plan_id}`);
      if (data && data.length > 0) {
        setNewDetail(data);
      } else {
        setNewDetail({ block: null });
      }
    } catch (error) {
      console.error('Refreshing trip details error:', error);
    }
  }, [trip_plan_id]);




  //TODO
  //讀取trip_calendar的資料，並根據 trip_plan_id 獲取行程詳情

  //TODO
  //根據時段是否有行程決定顯示的內容
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <AccountLoader type="index" />
      </div>
    );
  }

  return (

    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-col min-h-screen">
        <TripSidebar2
          tripName={tripName}
          trip_plan_id={tripName.trip_plan_id}
        />

        <div className="flex justify-center items-start w-full py-8 overflow-x-hidden">
          <div className="hidden sm:flex min-w-[300px] justify-end">
            <BarPhotoCarousel
              trip_plan_id={trip_plan_id}
              refreshAllDetails={refreshAllDetails}
            />
          </div>
          <div className="mt-8 mb-8 flex flex-col justify-center items-center gap-8 w-full max-w-5xl px-4 flex-shrink-0">
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
          <div className="hidden sm:flex min-w-[300px] justify-start">
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
