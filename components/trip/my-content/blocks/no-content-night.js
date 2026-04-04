import NoContentBase from '../no-content-base';

export default function NoContentNight({ trip_plan_id, refreshTripDetails, refreshAllDetails }) {
  return (
    <NoContentBase
      trip_plan_id={trip_plan_id}
      refreshTripDetails={refreshTripDetails}
      refreshAllDetails={refreshAllDetails}
      block={3}
      label="晚上"
    />
  );
}
