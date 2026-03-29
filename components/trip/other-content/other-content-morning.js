import { useState, useEffect } from 'react';
import { TripService } from '@/services/trip-service';
import OtherNoContentMorning from './other-no-content-morning';
import MoviePhotoOther from './movie-photo-other';
import BarPhotoOther from './bar-photo-other';
import NoContentNoon from '../my-content/no-content-noon';

export default function OtherContentMorning({ trip_plan_id }) {
  const [tripDetails, setTripDetails] = useState({});

  useEffect(() => {
    if (trip_plan_id) {
      const fetchTripDetails = async () => {
        try {
          const result = await TripService.getMorningContent(trip_plan_id);
          // 假設 data 是數組或需要訪問特定屬性
          if (result && result.length > 0) {
            setTripDetails(result[0]);
          } else {
            // 設置一個明確的“沒有內容”的狀態
            setTripDetails({ block: null });
          }
        } catch (error) {
          console.error('Fetching trip details error:', error);
          // 在錯誤情況下也設置一個明確狀態
          setTripDetails({ block: null });
        }
      };

      fetchTripDetails();
    }
  }, [trip_plan_id]);

  // 根據 block 值來決定顯示哪個組件
  //   const content =
  //     tripDetails.block === 1 ? <TripPhotoMy /> : <NoContentMorning />;

  return (
    <>
      {tripDetails.block !== 1 ? (
        <OtherNoContentMorning />
      ) : tripDetails.movie_id ? (
        <MoviePhotoOther
          trip_plan_id={trip_plan_id}
          tripDetails={tripDetails}
        />
      ) : tripDetails.bar_id ? (
        <BarPhotoOther trip_plan_id={trip_plan_id} tripDetails={tripDetails} />
      ) : (
        <NoContentNoon />
      )}
    </>
  );
}
