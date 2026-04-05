import { useState, useEffect } from 'react';
import MoviePhotoOther from './movie-photo-other';
import BarPhotoOther from './bar-photo-other';

export default function OtherContentBase({
  trip_plan_id,
  block,
  fetchMethod,
  OtherNoContentComponent,
  newDetail,
  barPhotos,
  barNames,
  moviePhotos,
}) {
  const [tripDetailsList, setTripDetailsList] = useState([]);

  useEffect(() => {
    if (newDetail && Array.isArray(newDetail)) {
      const filtered = newDetail.filter(d => d.block === block);
      setTripDetailsList(filtered);
    }
  }, [newDetail, block]);

  return (
    <div className="flex flex-col items-center sm:flex-row sm:flex-wrap gap-6 sm:gap-10 justify-center w-full transition-all duration-300 overflow-visible">
      {tripDetailsList.length === 0 ? (
        <OtherNoContentComponent />
      ) : (
        tripDetailsList.map((details, index) => {
          if (!details.movie_id && !details.bar_id) return null;

          return (
            <div key={details.trip_detail_id || index} className="w-full sm:w-auto flex-shrink transition-transform duration-300 animate__animated animate__fadeInUp text-center sm:text-left">
              {details.movie_id ? (
                <MoviePhotoOther
                  trip_plan_id={trip_plan_id}
                  tripDetails={details}
                  moviePhotos={moviePhotos}
                />
              ) : (
                <BarPhotoOther 
                  trip_plan_id={trip_plan_id} 
                  tripDetails={details} 
                  barPhotos={barPhotos}
                  barNames={barNames}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
