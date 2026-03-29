import TripSidebarBase from './trip-sidebar-base';

export default function MyTripDetailSidebar({
  trip_plan_id,
  tripDetails,
  refreshTripDetails,
}) {
  return (
    <TripSidebarBase
      trip_plan_id={trip_plan_id}
      tripDetails={tripDetails}
      refreshTripDetails={refreshTripDetails}
      isMyTrip={true}
    />
  );
}
