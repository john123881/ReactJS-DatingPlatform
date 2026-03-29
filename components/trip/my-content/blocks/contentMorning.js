import { TripService } from '@/services/trip-service';
import NoContentMorning from './no-content-morning';
import ContentBase from '../content-base';

export default function ContentMorning({ trip_plan_id, newDetail }) {
  return (
    <ContentBase
      trip_plan_id={trip_plan_id}
      newDetail={newDetail}
      block={1}
      fetchMethod={TripService.getMorningContent}
      NoContentComponent={NoContentMorning}
    />
  );
}
