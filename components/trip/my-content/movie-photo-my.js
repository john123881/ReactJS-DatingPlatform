import { useState, useEffect } from 'react';
import { TripService } from '@/services/trip-service';
import WithContent from './with-content';
import { useLoader } from '@/context/use-loader';
import NoContentMorning from './no-content-morning';
import NoContentNoon from './no-content-noon';
import NoContentNight from './no-content-night';

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

export default function MoviePhotoMy({
  trip_plan_id,
  tripDetails,
  refreshTripDetails,
}) {
  const [imageSrc2, setImageSrc2] = useState('');
  const [movieDetails, setMovieDetails] = useState({}); //用於保存取得的電影資訊
  const [showDetails, setShowDetails] = useState(false); // 控制顯示電影細節的狀態
  const [isEmpty, setIsEmpty] = useState(false); // 是否無內容
  const { open, close, isLoading } = useLoader();

  useEffect(() => {
    const fetchMovieImage = async () => {
      open();
      try {
        const result = await TripService.getMoviePhoto(trip_plan_id);
        // console.log('Received JSON:', data);
        ////用以區分每個block所顯示的內容////////
        const filteredData = result.filter(
          (trip) => trip.block == tripDetails.block,
        );

        // 檢查所有獲得的 data ，至多3個，找到第一個包含 bar_img的項目
        const imageData = filteredData.find(
          (item) => item.movie_img && item.movie_img.data,
        );
        if (imageData && imageData.movie_img && imageData.movie_img.data) {
          const base64String = bufferToBase64(imageData.movie_img.data);
          setImageSrc2(`data:image/jpeg;base64,${base64String}`);
          setMovieDetails({
            description: imageData.movie_description,
          });
          setIsEmpty(false);
        } else {
          // No movie_img found
          setIsEmpty(true);
        }
      } catch (error) {
        console.error('Error fetching the image:', error);
        setIsEmpty(true);
      }
      close();
    };
    if (trip_plan_id) {
      fetchMovieImage();
    }
  }, [trip_plan_id]); // 確保此 useEffect 依賴 trip_plan_id 來載入

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  if (isEmpty) {
    if (tripDetails.block === 1) {
      return (
        <NoContentMorning
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
        />
      );
    } else if (tripDetails.block === 2) {
      return (
        <NoContentNoon
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
        />
      );
    } else {
      return (
        <NoContentNight
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
        />
      );
    }
  }

  return (
    <div className="flex gap-2">
      <WithContent
        imageSrc={imageSrc2}
        altText={movieDetails.title}
        onClick={handleShowDetails}
        tripDetails={tripDetails}
        refreshTripDetails={refreshTripDetails}
      />
      {showDetails && movieDetails.description && (
        <div className="hidden h-32 overflow-y-auto w-96 line-clamp-4 sm:block">
          {movieDetails.description}
        </div>
      )}
    </div>
  );
}
