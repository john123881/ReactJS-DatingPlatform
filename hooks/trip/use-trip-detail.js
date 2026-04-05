import { useState, useEffect, useCallback } from 'react';
import { TripService } from '@/services/trip-service';

// 輔助函式：將Buffer轉換成base64 (用於前端處理二進位圖片)
function bufferToBase64(buffer) {
  if (!buffer) return '';
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof window !== 'undefined' ? window.btoa(binary) : '';
}

/**
 * 自定義 Hook 用於管理行程詳情資料
 * @param {string|number} trip_plan_id 行程 ID
 * @returns {object} 資料狀態與刷新函數
 */
export function useTripDetail(trip_plan_id) {
  const [tripDetails, setTripDetails] = useState({});
  const [tripName, setTripName] = useState({});
  const [newDetail, setNewDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [barPhotos, setBarPhotos] = useState([]);
  const [barNames, setBarNames] = useState([]);
  const [moviePhotos, setMoviePhotos] = useState([]);

  const fetchData = useCallback(async () => {
    if (!trip_plan_id || trip_plan_id === 'undefined') {
        setIsLoading(false);
        return;
    }
    
    try {
      const [nameData, allDayData, barPhotosData, barNamesData, moviePhotosData] = await Promise.all([
        TripService.getTripPlanInfo(trip_plan_id),
        TripService.getAlldayDetails(trip_plan_id),
        TripService.getBarPhoto(trip_plan_id),
        TripService.getBarName(trip_plan_id),
        TripService.getMoviePhoto(trip_plan_id)
      ]);

      // 設置行程詳情
      if (allDayData && allDayData.length > 0) {
        setTripDetails(allDayData[0]);
        setNewDetail(allDayData);
      } else {
        setTripDetails({});
        setNewDetail({ block: null });
      }
      
      if (nameData) {
        setTripName(Array.isArray(nameData) ? nameData[0] : nameData);
      }

      // 預處理媒體資料：將 Buffer 直接轉為 Base64 字串，避免子組件重複計算導致卡頓
      const processedBarPhotos = (barPhotosData || []).map(item => {
        let src = '';
        if (item.bar_img_url) {
          src = item.bar_img_url;
        } else if (item.bar_img?.data) {
          src = `data:image/jpeg;base64,${bufferToBase64(item.bar_img.data)}`;
        }
        return { ...item, processedSrc: src };
      });

      const processedMoviePhotos = (moviePhotosData || []).map(item => {
        let src = '';
        if (item.movie_img_url) {
          src = item.movie_img_url;
        } else if (item.movie_img?.data) {
          src = `data:image/jpeg;base64,${bufferToBase64(item.movie_img.data)}`;
        }
        return { ...item, processedSrc: src };
      });

      setBarPhotos(processedBarPhotos);
      setBarNames(barNamesData || []);
      setMoviePhotos(processedMoviePhotos);
      
    } catch (error) {
      console.error('Error fetching trip detail data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [trip_plan_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    tripDetails, 
    tripName, 
    newDetail, 
    setNewDetail,
    barPhotos,
    barNames,
    moviePhotos,
    isLoading, 
    refresh: fetchData 
  };
}
