import { useState, useEffect, useCallback } from 'react';
import { TripService } from '@/services/trip-service';

/**
 * 自定義 Hook 用於管理行程詳情資料
 * @param {string|number} trip_plan_id 行程 ID
 * @returns {object} 資料狀態與刷新函數
 */
export function useTripDetail(trip_plan_id) {
  const [tripDetails, setTripDetails] = useState({});
  const [tripName, setTripName] = useState({});
  const [newDetail, setNewDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!trip_plan_id || trip_plan_id === 'undefined') {
        setIsLoading(false);
        return;
    }
    
    try {
      setIsLoading(true);
      const [nameData, allDayData] = await Promise.all([
        TripService.getTripPlanInfo(trip_plan_id),
        TripService.getAlldayDetails(trip_plan_id)
      ]);

      // 設置行程詳情 (首筆內容備用)
      if (allDayData && allDayData.length > 0) {
        setTripDetails(allDayData[0]);
        setNewDetail(allDayData);
      } else {
        setTripDetails({});
        setNewDetail({ block: null });
      }
      
      // 設置行程基本資訊 (標題, 日期, 描述, 筆記)
      if (nameData) {
        setTripName(Array.isArray(nameData) ? nameData[0] : nameData);
      }
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
    isLoading, 
    refresh: fetchData 
  };
}
