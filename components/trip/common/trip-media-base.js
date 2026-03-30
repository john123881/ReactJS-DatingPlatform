import { useState, useEffect } from 'react';
import { useLoader } from '@/context/use-loader';
import { TripService } from '@/services/trip-service';

// 輔助函式：將Buffer轉換成base64
function bufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default function TripMediaBase({
  trip_plan_id,
  tripDetails,
  refreshTripDetails,
  type, // 'bar' 或 'movie'
  ContentComponent,
  NoContentComponents = {},
  isOther = false,
}) {
  const [imageSrc, setImageSrc] = useState('');
  const [details, setDetails] = useState({});
  const [showDetails, setShowDetails] = useState(isOther);
  const [isEmpty, setIsEmpty] = useState(false);
  const { open, close } = useLoader();

  // 根據 type 設定對應的 fetch 方法與欄位名稱
  let config = {};
  switch (type) {
    case 'bar':
      config = {
        imageFetch: () => TripService.getBarPhoto(trip_plan_id),
        detailsFetch: () => TripService.getBarName(trip_plan_id),
        imageProp: 'bar_img',
        nameProp: 'bar_name',
        descProp: 'bar_description',
      };
      break;
    case 'movie':
    default:
      config = {
        imageFetch: () => TripService.getMoviePhoto(trip_plan_id),
        detailsFetch: null,
        imageProp: 'movie_img',
        nameProp: 'title',
        descProp: 'movie_description',
      };
      break;
  }

  useEffect(() => {
    if (!trip_plan_id) return;

    const fetchData = async () => {
      if (!isOther) open();
      try {
        // 抓取圖片 (對電影來說也包含詳情)
        const imageResult = await config.imageFetch();
        const filteredImage = imageResult.filter(
          (t) => t.block == tripDetails.block,
        );
        const imageData = filteredImage.find(
          (item) => item[config.imageProp] && item[config.imageProp].data,
        );

        let hasData = false;

        if (imageData) {
          const base64String = bufferToBase64(imageData[config.imageProp].data);
          setImageSrc(`data:image/jpeg;base64,${base64String}`);

          // 如果是電影，詳情就在同一個物件裡
          if (!config.detailsFetch) {
            setDetails({
              name: imageData[config.nameProp] || '',
              description: imageData[config.descProp] || '',
            });
          }
          hasData = true;
        }

        // 抓取詳情 (僅限 Bar)
        if (config.detailsFetch) {
          const detailsResult = await config.detailsFetch();
          const filteredDetails = detailsResult.filter(
            (t) => t.block == tripDetails.block,
          );
          if (filteredDetails.length > 0) {
            setDetails({
              name: filteredDetails[0][config.nameProp] || '',
              description: filteredDetails[0][config.descProp] || '',
            });
            hasData = true;
          }
        }

        // 如果完全沒抓到圖片也沒抓到名稱，則視為空
        if (!hasData) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
        }
      } catch (error) {
        console.error(`Error fetching ${type} content:`, error);
        setIsEmpty(true);
      } finally {
        if (!isOther) close();
      }
    };

    fetchData();
  }, [trip_plan_id, tripDetails, isOther, type, config.imageProp]);

  // Fallback 邏輯 (僅限我的行程)
  if (!isOther && isEmpty) {
    const NC = NoContentComponents[tripDetails.block] || NoContentComponents[1];
    if (NC) {
      return (
        <NC
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
          trip_detail_id={tripDetails.trip_detail_id}
          isGhost={true}
        />
      );
    }
  }

  // 如果是他人行程且完全沒資料，這裡可以選擇回傳 null 或空 div (目前保持原樣)
  if (isOther && isEmpty) {
    return <div className="flex gap-2"><ContentComponent imageSrc="" altText="" /></div>;
  }

  return (
    <div
      className="flex items-center justify-center gap-0 sm:gap-4 transition-all duration-500 ease-in-out group/media"
      onMouseEnter={() => !isOther && setShowDetails(true)}
      onMouseLeave={() => !isOther && setShowDetails(false)}
    >
      <div className="transition-all duration-500 ease-out flex-shrink-0 hover:translate-y-[-10px]">
        <ContentComponent
          imageSrc={imageSrc}
          altText={details.name}
          onClick={isOther ? null : () => setShowDetails(!showDetails)}
          tripDetails={tripDetails}
          refreshTripDetails={refreshTripDetails}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] flex items-center ${
          showDetails || isOther
            ? 'max-w-[400px] opacity-100 ml-6 transform translate-x-0'
            : 'max-w-0 opacity-0 ml-0 transform translate-x-[-20px]'
        }`}
      >
        {details.description && (
          <div className="w-80 lg:w-96 flex-shrink-0 text-gray-300 leading-relaxed line-clamp-4 overflow-y-auto max-h-32 lg:max-h-48 drop-shadow-lg">
            {details.description}
          </div>
        )}
      </div>
    </div>
  );
}
