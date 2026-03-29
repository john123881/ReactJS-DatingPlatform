import TripSidebarBase from './trip-sidebar-base';

export default function OtherTripDetailSidebar({
  tripName,
}) {
  return (
    <TripSidebarBase
      tripName={tripName}
      titlePrefix="行程探索"
      usernamePrefix="由 "
      backLink="/trip/other-trip"
      backLabel="查看更多行程"
    />
  );
}
