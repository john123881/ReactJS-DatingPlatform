import { useState, useEffect, useCallback } from 'react';
import TripNavigationTab from '../../../components/trip/sidebars/trip-navigation-tab';
import TripCard from '@/components/trip/common/trip-card';
import { useAuth } from '@/context/auth-context';
import Router from 'next/router';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import { apiClient } from '@/services/api-client';
import { TripService } from '@/services/trip-service';
import { toast } from '@/lib/toast';

export default function MyTrip({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth, isAuthLoaded, setLoginModalToggle } = useAuth();
  const [trips, setTrips] = useState([]);
  const [tripDate, setTripDate] = useState('');
  const [tripTitle, setTripTitle] = useState('');
  const [otherTrips, setOtherTrips] = useState([]);
  const { open, close, isLoading: isContextLoading } = useLoader();

  // Auth Guard
  useEffect(() => {
    if (isAuthLoaded && auth.id === 0) {
      setLoginModalToggle(true);
    }
  }, [isAuthLoaded, auth.id, setLoginModalToggle]);

  const today = new Date();
  today.setHours(today.getHours() + 8);
  const localDate = today.toISOString().split('T')[0];

  const fetchTrips = useCallback(async () => {
    open();
    try {
      const data = await TripService.getTripPlans();
      setTrips(data || []);
    } catch (error) {
      console.error('Fetching trips error:', error);
    }
    close();
  }, [open, close]);

  const fetchOtherTrips = useCallback(async () => {
    open();
    try {
      const data = await TripService.getOtherPlans();
      setOtherTrips(data || []);
    } catch (error) {
      console.error('Fetching other trips error:', error);
    }
    close();
  }, [open, close]);

  useEffect(() => {
    if (auth.id === 0) return;
    fetchTrips();
    fetchOtherTrips();
  }, [auth.id, fetchTrips, fetchOtherTrips]);

  const onDeleteSuccess = useCallback((tripPlanId) => {
    setTrips((prev) => prev.filter((trip) => trip.trip_plan_id !== tripPlanId));
  }, []);

  const onDeleteRollback = useCallback((originalTrip) => {
    setTrips((prev) => {
      // 避免重複加入
      if (prev.find(t => t.trip_plan_id === originalTrip.trip_plan_id)) return prev;
      // 將行程加回列表（通常加在原位或末尾，這裡簡單處理加在前面或保持原有排序邏輯）
      const newTrips = [...prev, originalTrip];
      // 依日期排序（可選，與原始載入邏輯保持一致）
      return newTrips.sort((a, b) => new Date(b.trip_date) - new Date(a.trip_date));
    });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const fullPayload = {
        tripPlan: {
          trip_date: tripDate,
          trip_title: tripTitle,
          trip_content: '',
          trip_notes: '',
          trip_description: '',
          trip_pic: null,
          trip_draft: 0
        },
        calendarData: {}
      };

      let data = await TripService.addTripPlan(fullPayload);
      
      if (data && (data.success !== false && data.success !== 'false')) {
        closeModal();
        const newTripPlanId = data.tripPlanId || data.insertId || data.id || (Array.isArray(data) ? data[0]?.trip_plan_id : data.data?.[0]?.trip_plan_id);
        if (newTripPlanId) {
          router.push(`/trip/my-trip/detail/${newTripPlanId}`);
        } else {
          fetchTrips();
        }
      } else {
        throw new Error(data.message || data.error || '新增資料到資料庫時出錯');
      }
    } catch (error) {
      console.error('Creating trip plan error:', error);
      toast.error('新增失敗', error.message || '連線錯誤');
    }
  };

  // 推薦區塊組件
  const RecommendBlock = () => (
    <div className="flex flex-col items-center justify-start w-full transition-all duration-500 delay-200">
      <div className="flex flex-col items-center justify-start w-full max-w-4xl py-12">
        <p className="mb-12 sm:text-2xl text-center text-white/80">
          立即規劃屬於自己的專屬行程
        </p>
        <p className="sm:text-2xl text-white/80 mb-12">還沒有任何想法嗎？參考看看別人的行程吧</p>
      </div>
      <div className="mb-24 w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-12 justify-items-center sm:justify-items-start">
          {otherTrips.map((otherTrip) => (
            <TripCard key={otherTrip.trip_plan_id} trip={otherTrip} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!isAuthLoaded) {
    return <Loader text="確認登入狀態中..." minHeight="80vh" />;
  }

  if (auth.id === 0) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageTitle pageTitle={pageTitle} />
      <TripNavigationTab />
      
      {/* 建立行程 Modal (穩定 Shell 的一部分，位置固定) */}
      {isModalOpen && (
        <dialog open className="modal">
          <form onSubmit={handleSubmit}>
            <div className="modal-box w-96 text-white bg-[#1a1a1a] border border-white/20 shadow-2xl rounded-2xl">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-neongreen rounded-full"></span>
                建立行程
              </h3>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-400">行程日期</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full bg-white/5 border-white/10 focus:border-neongreen transition-all"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    min={localDate}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-400">行程名稱</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-white/5 border-white/10 focus:border-neongreen transition-all"
                    placeholder="請輸入行程名稱"
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-action mt-8 flex gap-3">
                <button type="button" className="btn btn-ghost rounded-full px-8" onClick={closeModal}>取消</button>
                <button type="submit" className="btn bg-neongreen text-black border-none rounded-full px-8 hover:bg-[#8edb1a]">完成</button>
              </div>
            </div>
          </form>
        </dialog>
      )}

      {/* 主體內容區：確保 Shell 穩定 */}
      <div className="flex-grow w-full max-w-screen-2xl mx-auto px-6 sm:px-12 py-10">
        <div className="flex flex-col items-center sm:items-start justify-start">
          {/* 將新增按鈕提拔到 Shell 層級，不再隨資料切換而跳動 */}
          <button
            className="mt-12 mb-16 bg-black sm:text-2xl text-white border border-white/30 rounded-full px-8 py-3 hover:bg-neongreen hover:text-black hover:border-neongreen transition-all shadow-lg hover:shadow-[0_0_20px_rgba(160,255,31,0.3)] active:scale-95 disabled:opacity-50"
            onClick={openModal}
            disabled={isContextLoading}
          >
            {isContextLoading ? "正在讀取..." : "+ 新增行程"}
          </button>
          
          <div className="w-full mt-4 min-h-[500px]">
            {isContextLoading ? (
              <div className="flex justify-center items-center h-[400px] animate__animated animate__fadeIn">
                <Loader text="加載中..." minHeight="300px" />
              </div>
            ) : (
              <div className="animate__animated animate__fadeIn">
                {trips.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-12 justify-items-center sm:justify-items-start">
                    {trips.map((trip) => (
                      <TripCard
                        key={trip.trip_plan_id}
                        trip={trip}
                        isMyTrip={true}
                        onDeleteSuccess={onDeleteSuccess}
                        onDeleteRollback={onDeleteRollback}
                      />
                    ))}
                  </div>
                ) : (
                  <RecommendBlock />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
