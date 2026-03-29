import TripMediaBase from '../common/trip-media-base';
import OtherTripContent from './other-tripcontent';

export default function MoviePhotoOther(props) {
  return (
    <TripMediaBase
      {...props}
      type="movie"
      ContentComponent={OtherTripContent}
      isOther={true}
    />
  );
}
