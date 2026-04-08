import { TripService } from '@/services/trip-service';

export default function AddTripItem({
  item,
  type, // 'bar' 或 'movie'
  trip_detail_id,
  onClose,
  refreshTripDetails,
}) {
  // 根據類型定義配置
  let config = {};
  switch (type) {
    case 'bar':
      config = {
        idProp: 'bar_id',
        nameProp: 'bar_name',
        imgProp: 'bar_pic_name',
        imgPrefix: '/barPic/',
        fetchMethod: (data) => TripService.addBarToTrip(data),
        extraInfo: `${item.bar_area_name || ''} · ${item.bar_type_name || ''}`,
      };
      break;
    case 'movie':
      config = {
        idProp: 'movie_id',
        nameProp: 'title',
        imgProp: 'poster_img',
        imgPrefix: '/movie_img/',
        fetchMethod: (data) => TripService.addMovieToTrip(data),
        extraInfo: `${item.movie_type || ''}片`,
      };
      break;
    default:
      config = {};
      break;
  }

  const addItemToTrip = async () => {
    try {
      const result = await config.fetchMethod({
        trip_detail_id,
        [config.idProp]: item[config.idProp],
      });

      if (result.success) {
        refreshTripDetails();
        onClose();
      } else {
        alert('加入失敗: ' + (result.message || '未知錯誤'));
      }
    } catch (error) {
      console.error(`Error adding ${type} to trip:`, error);
      alert('發生錯誤: ' + error.message);
    }
  };

  const imgSrc = item[config.imgProp]
    ? `${config.imgPrefix}${item[config.imgProp]}`
    : '/unavailable-image.jpg';

  return (
    <div className="flex justify-start items-center w-full py-2 border-b border-gray-800 last:border-none">
      <div className="flex justify-start items-center flex-grow">
        <img
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover shadow-md"
          src={imgSrc}
          alt={`Image of ${item[config.nameProp]}`}
          onError={(e) => {
            e.target.src = '/unavailable-image.jpg';
          }}
        />
        <div className="flex flex-col justify-center sm:w-64 items-start ml-4 mr-4">
          <h2 className="text-white text-base sm:text-lg font-medium">
            {item[config.nameProp]}
          </h2>
          <div className="text-gray-400 text-xs sm:text-sm mt-1">
            {config.extraInfo}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={addItemToTrip}
        className="text-white hover:text-black text-xs sm:text-sm px-4 py-2 bg-black hover:bg-[#a0ff1f] rounded-full border border-white transition-colors"
      >
        加入行程
      </button>
    </div>
  );
}
