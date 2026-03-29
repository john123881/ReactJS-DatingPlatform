import { useState, useEffect } from 'react';
import WithContent from './with-content';
import { TripService } from '@/services/trip-service';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';

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

export default function BarPhotoMy({
  trip_plan_id,
  tripDetails,
  refreshTripDetails,
}) {
  const [imageSrc1, setImageSrc1] = useState(''); //儲存第一支api取得的數據
  const [barDetails, setBarDetails] = useState({}); //儲存第二支api取得的數據
  const [showDetails, setShowDetails] = useState(false); // 控制顯示 Bar 細節的狀態
  const { open, close, isLoading } = useLoader();

  useEffect(() => {
    const fetchBarImage = async () => {
      open();
      try {
        const result = await TripService.getBarPhoto(trip_plan_id);
        // console.log('Received JSON:', data);
        ////用以區分每個block所顯示的內容////////
        const filteredData = data.filter(
          (trip) => trip.block == tripDetails.block,
        );

        // 檢查所有獲得的 data ，至多3個，找到第一個包含 bar_img的項目
        const imageData = filteredData.find(
          (item) => item.bar_img && item.bar_img.data,
        );
        if (imageData && imageData.bar_img && imageData.bar_img.data) {
          const base64String = bufferToBase64(imageData.bar_img.data);
          setImageSrc1(`data:image/jpeg;base64,${base64String}`);
        } else {
          // No bar_img found
        }
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
      close();
    };
    if (trip_plan_id) {
      fetchBarImage();
    }
  }, [trip_plan_id]); // 確保此 useEffect 依賴 trip_plan_id 來載入

  useEffect(() => {
    const fetchBarName = async () => {
      try {
        const result = await TripService.getBarName(trip_plan_id);
        // console.log('Received JSON:', data);
        ////用以區分每個block所顯示的內容////////
        const filteredData = data.filter(
          (trip) => trip.block == tripDetails.block,
        );

        if (filteredData && filteredData.length > 0) {
          setBarDetails({
            name: filteredData[0].bar_name,
            description: filteredData[0].bar_description,
          });
        } else {
          // No bar_name found
        }
      } catch (error) {
        console.error('Error fetching the bar_name:', error);
      }
    };

    if (trip_plan_id) {
      fetchBarName();
    }
  }, [trip_plan_id]); // 確保此 useEffect 依賴 trip_plan_id 來載入

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="flex gap-2">
      <WithContent
        imageSrc={imageSrc1}
        altText={barDetails.name}
        onClick={handleShowDetails}
        tripDetails={tripDetails}
        refreshTripDetails={refreshTripDetails}
      />
      {showDetails && (
        <div className="hidden h-32 overflow-y-auto w-96 line-clamp-4 sm:block">
          {barDetails.description}
        </div>
      )}
    </div>
  );
}
