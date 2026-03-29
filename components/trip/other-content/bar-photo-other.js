import { useState, useEffect } from 'react';
import { TripService } from '@/services/trip-service';
import OtherTripContent from './other-tripcontent';
import { useLoader } from '@/context/use-loader';

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

export default function BarPhotoOther({ trip_plan_id, tripDetails }) {
  const [imageSrc1, setImageSrc1] = useState('');
  const [barDetails, setBarDetails] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const { open, close } = useLoader();

  useEffect(() => {
    const fetchBarImage = async () => {
      open();
      try {
        const result = await TripService.getBarPhoto(trip_plan_id);
        const filteredData = data.filter(
          (trip) => trip.block == tripDetails.block,
        );
        const imageData = filteredData.find(
          (item) => item.bar_img && item.bar_img.data,
        );
        if (imageData) {
          const base64String = bufferToBase64(imageData.bar_img.data);
          setImageSrc1(`data:image/jpeg;base64,${base64String}`);
        } else {
          console.log('No bar_img found or data is incorrect');
        }
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
      close();
    };

    if (trip_plan_id) {
      fetchBarImage();
    }
  }, [trip_plan_id, tripDetails.block]);

  useEffect(() => {
    const fetchBarName = async () => {
      try {
        const result = await TripService.getBarName(trip_plan_id);
        // console.log(result);
        const filteredData = result.filter(
          (trip) => trip.block == tripDetails.block,
        );
        if (filteredData.length > 0) {
          setBarDetails({
            name: filteredData[0].bar_name,
            description: filteredData[0].bar_description,
          });
        } else {
          console.log('No bar_name found');
        }
      } catch (error) {
        console.error('Error fetching the bar_name:', error);
      }
    };

    if (trip_plan_id) {
      fetchBarName();
    }
  }, [trip_plan_id, tripDetails.block]);

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="flex gap-2">
      <OtherTripContent
        imageSrc={imageSrc1}
        altText={barDetails.name}
        // onClick={handleShowDetails}
      />

      <div className="hidden h-48 overflow-y-auto w-96 line-clamp-4 sm:block">
        {barDetails.description}
      </div>
    </div>
  );
}
