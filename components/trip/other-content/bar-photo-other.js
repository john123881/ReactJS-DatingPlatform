import TripMediaBase from '../common/trip-media-base';
import WithContent from '../my-content/with-content';

export default function BarPhotoOther(props) {
  return (
    <TripMediaBase
      {...props}
      type="bar"
      ContentComponent={WithContent}
      isOther={true}
    />
  );
}
