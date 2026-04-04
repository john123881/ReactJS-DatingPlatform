import TripSidebarBase from './trip-sidebar-base';

export default function MyTripDetailSidebar({
  tripName,
  refreshTripDetails,
}) {
  return (
    <TripSidebarBase
      tripName={tripName}
      titlePrefix="我的行程"
      backLink="/trip/my-trip"
      backLabel="返回行程列表"
      canEdit={true}
      onUpdateSuccess={refreshTripDetails}
    />
  );
}
