import { useState, useEffect } from 'react';
import MoviePhotoOther from './movie-photo-other';
import BarPhotoOther from './bar-photo-other';

export default function OtherContentBase({
  trip_plan_id,
  block,
  fetchMethod,
  OtherNoContentComponent,
}) {
  const [tripDetailsList, setTripDetailsList] = useState([]);

  useEffect(() => {
    if (newDetail && Array.isArray(newDetail)) {
      const filtered = newDetail.filter(d => d.block === block);
      setTripDetailsList(filtered.length > 0 ? [filtered[filtered.length - 1]] : []);
    } else if (trip_plan_id) {
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
  }, [newDetail, trip_plan_id, fetchMethod, block]);

  return (
    <div className="flex flex-wrap gap-8 justify-center lg:justify-start w-full">
      {tripDetailsList.length === 0 ? (
        <OtherNoContentComponent />
      ) : (
        tripDetailsList.map((details, index) => (
          <div key={details.trip_detail_id || index} className="flex-shrink-0">
            {details.movie_id ? (
              <MoviePhotoOther
                trip_plan_id={trip_plan_id}
                tripDetails={details}
              />
            ) : details.bar_id ? (
              <BarPhotoOther trip_plan_id={trip_plan_id} tripDetails={details} />
            ) : (
              <OtherNoContentComponent />
            )}
          </div>
        ))
      )}
    </div>
  );
}
