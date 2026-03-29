import { useState, useEffect } from 'react';
import BarPhotoMy from './bar-photo-my';
import MoviePhotoMy from './movie-photo-my';

export default function ContentBase({
  trip_plan_id,
  newDetail,
  block,
  fetchMethod,
  NoContentComponent,
}) {
  const [tripDetails, setTripDetails] = useState({});

  useEffect(() => {
    if (newDetail && Array.isArray(newDetail)) {
      const currentBlock = newDetail.find(d => d.block === block);
      if (currentBlock) {
        setTripDetails(currentBlock);
      } else {
        setTripDetails({ block: null });
      }
    } else if (!newDetail || Object.keys(newDetail).length === 0) {
      // 如果 newDetail 為空且有 ID，嘗試補抓一次 (備援)
      if (trip_plan_id) {
        const fetchData = async () => {
          try {
            const result = await fetchMethod(trip_plan_id);
            if (result && result.length > 0) {
              setTripDetails(result[0]);
            } else {
              setTripDetails({ block: null });
            }
          } catch (error) {
            console.error(`Fetching trip details error (block ${block}):`, error);
            setTripDetails({ block: null });
          }
        };
        fetchData();
      }
    }
  }, [newDetail, trip_plan_id, fetchMethod, block]);

  const refreshTripDetails = async () => {
    try {
      const result = await fetchMethod(trip_plan_id);
      if (result && result.length > 0) {
        setTripDetails(result[0]);
      } else {
        setTripDetails({ block: null });
      }
    } catch (error) {
      console.error(`Fetching trip details error (block ${block}):`, error);
      setTripDetails({ block: null });
    }
  };

  return (
    <>
      {tripDetails.block !== block ? (
        <NoContentComponent
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
        <NoContentComponent
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
        />
      )}
    </>
  );
}
