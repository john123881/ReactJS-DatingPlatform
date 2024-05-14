import React, { useState, useEffect } from 'react';
import NoContentMorning from './no-content-morning';
import BarPhotoMy from './bar-photo-my';
import MoviePhotoMy from './movie-photo-my';
import { useLoader } from '@/context/use-loader';

export default function ContentMorning({ trip_plan_id, newDetail }) {
  // console.log('Received trip_plan_id in ContentMorning:', trip_plan_id);
  const [tripDetails, setTripDetails] = useState({});
  const { close, isLoading } = useLoader();

  useEffect(() => {
    if (trip_plan_id) {
      const fetchTripDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/trip/my-details/morning-content/${trip_plan_id}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          // console.log('Fetched TripDetail Data:', data);
          // 假設 data 是數組或需要訪問特定屬性
          if (data && data.length > 0) {
            setTripDetails(data[0]);
            // console.log('Setting tripDetail to:', data[0]);
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

  //傳遞給子元件的函數 用於重新渲染頁面 刪除和新增都適用
  const refreshTripDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/trip/my-details/morning-content/${trip_plan_id}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // console.log('Fetched TripDetail Data:', data);
      if (data && data.length > 0) {
        setTripDetails(data[0]);
        // console.log('Setting tripDetail to:', data[0]);
      } else {
        setTripDetails({ block: null });
      }
    } catch (error) {
      console.error('Fetching trip details error:', error);
      setTripDetails({ block: null });
    }
  };
  // 根據 block 值來決定顯示哪個組件
  //   const content =
  //     tripDetails.block === 1 ? <TripPhotoMy /> : <NoContentMorning />;

  return (
    <>
      {tripDetails.block !== 1 ? (
        <NoContentMorning
          trip_plan_id={trip_plan_id}
          tripDetails={tripDetails}
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
        <NoContentMorning />
      )}
    </>
  );
}
