import NoContentBase from '../no-content-base';

export default function NoContentNight({ trip_plan_id, refreshTripDetails }) {
  return (
    <NoContentBase
      trip_plan_id={trip_plan_id}
      refreshTripDetails={refreshTripDetails}
      block={3}
      label="晚上"
    />
  );
}
