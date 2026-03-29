import { TripService } from '@/services/trip-service';
import OtherNoContentNight from './other-no-content-night';
import OtherContentBase from '../other-content-base';

export default function OtherContentNight({ trip_plan_id }) {
  return (
    <OtherContentBase
      trip_plan_id={trip_plan_id}
      block={3}
      fetchMethod={TripService.getNightContent}
      OtherNoContentComponent={OtherNoContentNight}
    />
  );
}
