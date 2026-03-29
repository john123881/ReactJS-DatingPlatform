import { TripService } from '@/services/trip-service';
import OtherNoContentMorning from './other-no-content-morning';
import OtherContentBase from '../other-content-base';

export default function OtherContentMorning({ trip_plan_id, newDetail }) {
  return (
    <OtherContentBase
      trip_plan_id={trip_plan_id}
      newDetail={newDetail}
      block={1}
      fetchMethod={TripService.getMorningContent}
      OtherNoContentComponent={OtherNoContentMorning}
    />
  );
}
