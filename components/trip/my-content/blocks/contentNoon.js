import { TripService } from '@/services/trip-service';
import NoContentNoon from './no-content-noon';
import ContentBase from '../content-base';

export default function ContentNoon({ trip_plan_id, newDetail }) {
  return (
    <ContentBase
      trip_plan_id={trip_plan_id}
      newDetail={newDetail}
      block={2}
      fetchMethod={TripService.getNoonContent}
      NoContentComponent={NoContentNoon}
    />
  );
}
