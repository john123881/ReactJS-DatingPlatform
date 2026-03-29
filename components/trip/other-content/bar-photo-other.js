import TripMediaBase from '../common/trip-media-base';
import OtherTripContent from './other-tripcontent';

export default function BarPhotoOther(props) {
  return (
    <TripMediaBase
      {...props}
      type="bar"
      ContentComponent={OtherTripContent}
      isOther={true}
    />
  );
}
