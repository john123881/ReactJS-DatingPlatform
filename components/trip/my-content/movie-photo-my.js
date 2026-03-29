import TripMediaBase from '../common/trip-media-base';
import WithContent from './with-content';
import NoContentMorning from './blocks/no-content-morning';
import NoContentNoon from './blocks/no-content-noon';
import NoContentNight from './blocks/no-content-night';

export default function MoviePhotoMy(props) {
  return (
    <TripMediaBase
      {...props}
      type="movie"
      ContentComponent={WithContent}
      NoContentComponents={{
        1: NoContentMorning,
        2: NoContentNoon,
        3: NoContentNight,
      }}
    />
  );
}
