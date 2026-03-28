import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/configs/api-config';
import NoContentNight from './no-content-night';
import BarPhotoMy from './bar-photo-my';
import MoviePhotoMy from './movie-photo-my';

export default function ContentNight({ trip_plan_id, newDetail }) {
  const [tripDetails, setTripDetails] = useState({});

  useEffect(() => {
    if (trip_plan_id) {
      const fetchTripDetails = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/trip/my-details/night-content/${trip_plan_id}`,
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          // 假設 data 是數組或需要訪問特定屬性
          if (data && data.length > 0) {
            setTripDetails(data[0]);
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
  }, [newDetail, trip_plan_id]);

  //傳遞給子元件的函數 用於重新渲染頁面
  const refreshTripDetails = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trip/my-details/night-content/${trip_plan_id}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setTripDetails(data[0]);
      } else {
        setTripDetails({ block: null });
      }
    } catch (error) {
      console.error('Fetching trip details error:', error);
      setTripDetails({ block: null });
    }
  };

  // 根據 block 值來決定顯示哪個組件
  return (
    <>
      {tripDetails.block !== 3 ? (
        <NoContentNight
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
        />
      ) : tripDetails.movie_id ? (
        <MoviePhotoMy
          trip_plan_id={trip_plan_id}
          tripDetails={tripDetails}
          refreshTripDetails={refreshTripDetails}
        />
      ) : tripDetails.bar_id ? (
        <BarPhotoMy
          trip_plan_id={trip_plan_id}
          tripDetails={tripDetails}
          refreshTripDetails={refreshTripDetails}
        />
      ) : (
        <NoContentNight
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
        />
      )}
    </>
  );
}
