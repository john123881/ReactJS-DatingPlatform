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
  const [tripDetailsList, setTripDetailsList] = useState([]);

  useEffect(() => {
    if (newDetail && Array.isArray(newDetail)) {
      const filtered = newDetail.filter(d => d.block === block);
      setTripDetailsList(filtered.length > 0 ? [filtered[filtered.length - 1]] : []);
    } else if (!newDetail || (typeof newDetail === 'object' && Object.keys(newDetail).length === 0)) {
      if (trip_plan_id) {
        const fetchData = async () => {
          try {
            const result = await fetchMethod(trip_plan_id);
            setTripDetailsList(result && result.length > 0 ? result : []);
          } catch (error) {
            console.error(`Fetching trip details error (block ${block}):`, error);
            setTripDetailsList([]);
          }
        };
        fetchData();
      }
    }
  }, [newDetail, trip_plan_id, fetchMethod, block]);

  const refreshTripDetails = async () => {
    try {
      const result = await fetchMethod(trip_plan_id);
      setTripDetailsList(result && result.length > 0 ? result : []);
    } catch (error) {
      console.error(`Fetching trip details error (block ${block}):`, error);
    }
  };

  return (
    <div className="flex flex-wrap gap-10 justify-center lg:justify-start w-full transition-all duration-300">
      {tripDetailsList.length === 0 ? (
        <NoContentComponent
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
        />
      ) : (
        tripDetailsList.map((details, index) => (
          <div key={details.trip_detail_id || index} className="flex-shrink-0 hover:scale-105 transition-transform duration-300">
            {details.movie_id ? (
              <MoviePhotoMy
                trip_plan_id={trip_plan_id}
                tripDetails={details}
                refreshTripDetails={refreshTripDetails}
              />
            ) : details.bar_id ? (
              <BarPhotoMy
                trip_plan_id={trip_plan_id}
                tripDetails={details}
                refreshTripDetails={refreshTripDetails}
              />
            ) : (
              <NoContentComponent
                trip_plan_id={trip_plan_id}
                refreshTripDetails={refreshTripDetails}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
