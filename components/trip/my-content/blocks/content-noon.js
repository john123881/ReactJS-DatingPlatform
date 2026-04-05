import { TripService } from '@/services/trip-service';
import NoContentNoon from './no-content-noon';
import ContentBase from '../content-base';

export default function ContentNoon({ trip_plan_id, newDetail, setNewDetail, refreshAllDetails, barPhotos, barNames, moviePhotos }) {
  return (
    <ContentBase
      trip_plan_id={trip_plan_id}
      newDetail={newDetail}
      block={2}
      fetchMethod={TripService.getNoonContent}
      NoContentComponent={NoContentNoon}
      refreshAllDetails={refreshAllDetails}
      setNewDetail={setNewDetail}
      barPhotos={barPhotos}
      barNames={barNames}
      moviePhotos={moviePhotos}
    />
  );
}
