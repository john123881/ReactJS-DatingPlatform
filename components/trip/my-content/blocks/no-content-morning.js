import NoContentBase from '../no-content-base';

export default function NoContentMorning({ trip_plan_id, refreshTripDetails, refreshAllDetails }) {
  return (
    <NoContentBase
      trip_plan_id={trip_plan_id}
      refreshTripDetails={refreshTripDetails}
      refreshAllDetails={refreshAllDetails}
      block={1}
      label="早上"
    />
  );
}
