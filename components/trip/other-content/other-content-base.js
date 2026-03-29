import { useState, useEffect } from 'react';
import MoviePhotoOther from './movie-photo-other';
import BarPhotoOther from './bar-photo-other';

export default function OtherContentBase({
  trip_plan_id,
  block,
  fetchMethod,
  OtherNoContentComponent,
}) {
  const [tripDetails, setTripDetails] = useState({});

  useEffect(() => {
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
  }, [trip_plan_id, fetchMethod, block]);

  return (
    <>
      {tripDetails.block !== block ? (
        <OtherNoContentComponent />
      ) : tripDetails.movie_id ? (
        <MoviePhotoOther
          trip_plan_id={trip_plan_id}
          tripDetails={tripDetails}
        />
      ) : tripDetails.bar_id ? (
        <BarPhotoOther trip_plan_id={trip_plan_id} tripDetails={tripDetails} />
      ) : (
        <OtherNoContentComponent />
      )}
    </>
  );
}
