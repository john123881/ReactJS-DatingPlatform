import { TripService } from '@/services/trip-service';
import OtherNoContentNoon from './other-no-content-noon';
import OtherContentBase from '../other-content-base';

export default function OtherContentNoon({ trip_plan_id }) {
  return (
    <OtherContentBase
      trip_plan_id={trip_plan_id}
      block={2}
      fetchMethod={TripService.getNoonContent}
      OtherNoContentComponent={OtherNoContentNoon}
    />
  );
}
