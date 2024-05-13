import React, { useState, useEffect } from 'react';
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

export default function MoviePhotoOther({ trip_plan_id, tripDetails }) {
  const [imageSrc2, setImageSrc2] = useState('');
  const [movieDetails, setMovieDetails] = useState({}); //用於保存取得的電影資訊
  const [showDetails, setShowDetails] = useState(false); // 控制顯示電影細節的狀態
  const { open, close, isLoading } = useLoader();
  console.log(movieDetails);

  useEffect(() => {
    const fetchMovieImage = async () => {
      open();
      try {
        const response = await fetch(
          `http://localhost:3001/trip/my-details/movie-photo/${trip_plan_id}`
        );
        if (!response.ok) {
          throw new Error('fetch 電影圖片失敗');
        }
        const data = await response.json();
        // console.log('Received JSON:', data);
        ////用以區分每個block所顯示的內容////////
        const filteredData = data.filter(
          (trip) => trip.block == tripDetails.block
        );

        // 檢查所有獲得的 data ，至多3個，找到第一個包含 bar_img的項目
        const imageData = filteredData.find(
          (item) => item.movie_img && item.movie_img.data
        );
        if (imageData && imageData.movie_img && imageData.movie_img.data) {
          const base64String = bufferToBase64(imageData.movie_img.data);
          console.log(
            'Generated Base64 Image URL:',
            `data:image/jpeg;base64,${base64String}`
          );
          setImageSrc2(`data:image/jpeg;base64,${base64String}`);
          setMovieDetails({
            title: imageData.title,
            description: imageData.movie_description,
          });
          console.log(movieDetails);
        } else {
          console.log('No movie_img found or data is incorrect');
        }
      } catch (error) {
        console.error('Error fetching the image:', error);
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

  return (
    <div className="flex gap-2">
      <OtherTripContent
        imageSrc={imageSrc2}
        altText={movieDetails.title}
        // onClick={handleShowDetails}
      />
      {/* {showDetails && (
        <div className="hidden h-48 overflow-scroll w-96 line-clamp-4 sm:block">
          {movieDetails.description}
        </div>
      )} */}

      <div className="hidden h-48 overflow-y-auto w-96 line-clamp-4 sm:block">
        {movieDetails.description}
      </div>
    </div>
  );
}
