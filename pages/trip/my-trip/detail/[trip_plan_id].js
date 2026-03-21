import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import TripSidebar2 from '@/components/trip/sidebars/trip-sidebar2';
import ContentMorning from '@/components/trip/my-content/contentMorning';
import ContentNoon from '@/components/trip/my-content/contentNoon';
import ContentNight from '@/components/trip/my-content/contentNight';
import BarPhotoCarousel from '@/components/trip/carousel/bar-photo-carousel';
import MoviePhotoCarousel2 from '@/components/trip/carousel/movie-photo-carousel2';
import PageTitle from '@/components/page-title';
import { API_BASE_URL } from '@/configs/api-config';

export default function MyTripDetail({ onPageChange }) {
  const router = useRouter();

  const { trip_plan_id } = router.query;
  const [tripDetails, setTripDetails] = useState({}); //用於儲存從trip_calendar中獲取的值
  const [tripName, setTripName] = useState({}); //用於儲存從trip_plans中獲取的值
  const [newDetail, setNewDetail] = useState({});
  const pageTitle = '行程規劃';
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  useEffect(() => {
    if (trip_plan_id === 'undefined') {
      router.replace('/trip/my-trip');
    }
  }, [trip_plan_id, router]);

  //trip_calendar 的資料
  useEffect(() => {
    if (trip_plan_id) {
      const fetchTripDetails = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/trip/my-details/${trip_plan_id}`,
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setTripDetails(data[0]);
        } catch (error) {
          console.error('Fetching trip details error:', error);
        }
      };

      fetchTripDetails();
    }
  }, [trip_plan_id]);

  //trip_plans 的資料
  useEffect(() => {
    if (trip_plan_id) {
      const fetchTripName = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/trip/my-details/trip-plan/${trip_plan_id}`,
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Fetched Trip Name Data:', data);
          if (data) {
            setTripName(data);
            console.log('Setting tripName to:', data);
          }
        } catch (error) {
          console.error('Fetching trip details error:', error);
        }
      };

      fetchTripName();
    }
  }, [trip_plan_id]);

  //傳遞給子元件的函數 用於重新渲染頁面 針對三個時段的行程細節
  const refreshAllDetails = useCallback(async () => {
    if (!trip_plan_id) return;
    console.log('Calling refreshAllDetails');
    try {
      const response = await fetch(
        `${API_BASE_URL}/trip/my-details/allday-content/${trip_plan_id}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched TripDetail Data:', data);
      if (data && data.length > 0) {
        setNewDetail(data);
      } else {
        setNewDetail({ block: null });
      }
    } catch (error) {
      console.error('Fetching trip details error:', error);
      setNewDetail({ block: null });
    }
  }, [trip_plan_id]);

  useEffect(() => {
    console.log('refreshAllDetails in parent:', refreshAllDetails);
  }, [refreshAllDetails]);

  //TODO
  //讀取trip_calendar的資料，並根據 trip_plan_id 獲取行程詳情

  //TODO
  //根據時段是否有行程決定顯示的內容
  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-col min-h-screen">
        <TripSidebar2
          tripName={tripName}
          trip_plan_id={tripName.trip_plan_id}
        />

        <div className="flex justify-center items-center w-full py-8">
          <BarPhotoCarousel
            trip_plan_id={trip_plan_id}
            refreshAllDetails={refreshAllDetails}
          />
          <div className="mt-8 mb-8 flex flex-col justify-center items-center gap-8 w-full max-w-5xl px-4">
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
          <MoviePhotoCarousel2
            trip_plan_id={trip_plan_id}
            refreshAllDetails={refreshAllDetails}
          />
        </div>
      </div>
    </>
  );
}
