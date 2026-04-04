import NoContentBase from '../no-content-base';

export default function NoContentNoon({ trip_plan_id, refreshTripDetails, refreshAllDetails }) {
  return (
    <NoContentBase
      trip_plan_id={trip_plan_id}
      refreshTripDetails={refreshTripDetails}
      refreshAllDetails={refreshAllDetails}
      block={2}
      label="下午"
    />
  );
}
