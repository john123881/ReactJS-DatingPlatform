import { TripService } from '@/services/trip-service';
import NoContentNight from './no-content-night';
import ContentBase from '../content-base';

export default function ContentNight({ trip_plan_id, newDetail, setNewDetail, refreshAllDetails }) {
  return (
    <ContentBase
      trip_plan_id={trip_plan_id}
      newDetail={newDetail}
      block={3}
      fetchMethod={TripService.getNightContent}
      NoContentComponent={NoContentNight}
      refreshAllDetails={refreshAllDetails}
      setNewDetail={setNewDetail}
    />
  );
}
