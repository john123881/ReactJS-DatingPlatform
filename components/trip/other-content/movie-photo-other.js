import TripMediaBase from '../common/trip-media-base';
import WithContent from '../my-content/with-content';

export default function MoviePhotoOther(props) {
  return (
    <TripMediaBase
      {...props}
      type="movie"
      ContentComponent={WithContent}
      isOther={true}
    />
  );
}
