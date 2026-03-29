import NoContentBase from '../no-content-base';

export default function NoContentMorning({ trip_plan_id, refreshTripDetails }) {
  return (
    <NoContentBase
      trip_plan_id={trip_plan_id}
      refreshTripDetails={refreshTripDetails}
      block={1}
      label="早上"
    />
  );
}
