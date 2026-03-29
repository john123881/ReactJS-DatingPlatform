import NoContentBase from '../no-content-base';

export default function NoContentNoon({ trip_plan_id, refreshTripDetails }) {
  return (
    <NoContentBase
      trip_plan_id={trip_plan_id}
      refreshTripDetails={refreshTripDetails}
      block={2}
      label="下午"
    />
  );
}
