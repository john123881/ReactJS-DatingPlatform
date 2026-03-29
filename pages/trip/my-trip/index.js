import { useState, useEffect, useCallback } from 'react';
import TripNavigationTab from '../../../components/trip/sidebars/trip-navigation-tab';
import TripCard from '@/components/trip/common/trip-card';
import { useAuth } from '@/context/auth-context';
import Router from 'next/router';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import Swal from 'sweetalert2';
import { apiClient } from '@/services/api-client';
import { TripService } from '@/services/trip-service';


export default function MyTrip({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);
  const { auth, getAuthHeader } = useAuth();
  const [trips, setTrips] = useState([]);
  const [userId, setUserId] = useState(null); // 添加 user_id 狀態
  const [tripDate, setTripDate] = useState('');
  const [tripTitle, setTripTitle] = useState('');
  const [otherTrips, setOtherTrips] = useState([]);
  const { open, close, isLoading } = useLoader();
  //為日期選擇設下限制，不能選擇今天以前的日期
  const today = new Date();
  today.setHours(today.getHours() + 8); // 加八個小時
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

  useEffect(() => {
    if (auth.id === 0) return;
    fetchTrips();
    // 這裡原本有 jwt 解碼邏輯，但 auth.id 已經可用，故移除。
  }, [auth.id, fetchTrips]);

  /////////////在尚無行程時顯示其他人的推薦行程//////////////////////
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
    fetchOtherTrips();
  }, [auth.id, fetchOtherTrips]);

  ////////////////////////////////////////////////////////
  const onDeleteSuccess = useCallback((tripPlanId) => {
    // 過濾掉被刪除的行程
    setTrips((prev) => prev.filter((trip) => trip.trip_plan_id !== tripPlanId));
  }, []);

  // 以 useState 控制 modal 的開關
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 開啟modal
  const openModal = () => setIsModalOpen(true);

  // 關閉modal
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // 建立完整承載，補齊所有可能的資料庫欄位，避免 NOT NULL 約束衝突
      const fullPayload = {
        user_id: auth.id,
        trip_date: tripDate,
        trip_title: tripTitle,
        trip_content: '',
        trip_notes: '',
        trip_description: '',
        trip_pic: null,
        trip_draft: 0
      };


      let data;
      try {
        // 預設發送 FLAT 結構
        data = await TripService.addTripPlan(fullPayload);
        
        if (data && data.success === false) {
           console.warn('Flat payload failed with success:false, retrying with Nested wrapper...');
           data = await TripService.addTripPlan({
             tripPlan: fullPayload
           });
        }
      } catch (e) {
        console.warn('First attempt failed, retrying with Nested payload...', e);
        data = await TripService.addTripPlan({
          tripPlan: fullPayload
        });
      }


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
      Swal.fire({
        icon: 'error',
        title: '新增失敗',
        text: error.message || '連線錯誤或資料結構不符',
        background: '#2a303c',
        color: '#ffffff',
        confirmButtonColor: '#a0ff1f',
        customClass: {
          confirmButton: 'text-black font-bold border-none px-6 py-2',
          popup: 'border-2 border-[#a0ff1f] rounded-box shadow-[0_0_20px_rgba(160,255,31,0.3)]'
        }
      });
    }
  };

  const recommend = (
    <div className="flex flex-wrap justify-center mx-5 my-5 min-h-screen">
      <div className="flex flex-col items-center justify-start w-full max-w-4xl sm:mt-24">
        <p className="mb-12 sm:text-2xl text-center">
          立即規劃屬於自己的專屬行程
        </p>
        <div className="mb-16">
          {/* 更新按鈕的onClick處理函式，以開啟彈出視窗 */}
          <button
            className="mt-5 mb-5 bg-black sm:text-2xl text-white border border-white rounded-full px-5 py-2.5 hover:bg-[#a0ff1f] hover:text-black hover:border-black"
            onClick={openModal}
          >
            新增行程
          </button>
          {/* 以 useState 來控制<dialog> */}
          {isModalOpen && (
            <dialog open id="my_modal_1" className="modal">
              <form onSubmit={handleSubmit}>
                <div className="modal-box w-96">
                  <h3 className="font-bold text-lg mb-4 text-white">
                    建立行程
                  </h3>
                  <input type="hidden" name="user_id" value={auth.id} />
                  <p className="text-white">行程日期</p>
                  <input
                    type="date"
                    name="trip_date"
                    className="mt-4 mb-4 px-2 py-1 w-full"
                    value={tripDate}
                    onChange={(event) => setTripDate(event.target.value)}
                    min={localDate}
                    required
                  />
                  <p className="text-white">行程名稱</p>
                  <input
                    type="text"
                    name="trip_title"
                    className="mt-4 mb-4 px-2 py-1 w-full"
                    placeholder="請輸入行程名稱"
                    value={tripTitle}
                    onChange={(event) => setTripTitle(event.target.value)}
                    required
                  />
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                      onClick={closeModal}
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                    >
                      完成
                    </button>
                  </div>
                </div>
              </form>
            </dialog>
          )}
        </div>
        <p className="sm:text-2xl">還沒有任何想法嗎？參考看看別人的行程吧</p>
      </div>
      <div className="mb-24 w-full max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 justify-items-center">
          {otherTrips.map((otherTrip) => (
            <TripCard key={otherTrip.trip_plan_id} trip={otherTrip} />
          ))}
        </div>
      </div>
    </div>
  );

  if (trips.length > 0) {
    return (
      <>
        <PageTitle pageTitle={pageTitle} />
        <div className="flex flex-col min-h-screen">
          <TripNavigationTab />
          {isLoading ? (
            <Loader />
          ) : (
            <div className="flex-grow w-full max-w-screen-2xl mx-auto px-6 sm:px-12">
              <div className="flex flex-col items-center sm:items-start justify-start">
                <button
                  className="mt-12 mb-8 bg-black sm:text-2xl text-white border border-white/30 rounded-full px-8 py-3 hover:bg-neongreen hover:text-black hover:border-neongreen transition-all shadow-lg hover:shadow-[0_0_20px_rgba(160,255,31,0.3)] active:scale-95"
                  onClick={openModal}
                >
                  + 新增行程
                </button>
                {/* 以 useState 來控制<dialog> */}
                {isModalOpen && (
                  <dialog open id="my_modal_1" className="modal">
                    <form onSubmit={handleSubmit}>
                      <div className="modal-box w-96">
                        <h3 className="font-bold text-lg mb-4 text-white">
                          建立行程
                        </h3>
                        <input type="hidden" name="user_id" value={auth.id} />
                        <p className="text-white">行程日期</p>
                        <input
                          type="date"
                          name="trip_date"
                          className="mt-4 mb-4 px-2 py-1 w-full"
                          value={tripDate}
                          onChange={(event) => setTripDate(event.target.value)}
                          min={localDate}
                          required
                        />
                        <p className="text-white">行程名稱</p>
                        <input
                          type="text"
                          name="trip_title"
                          className="mt-4 mb-4 px-2 py-1 w-full"
                          placeholder="請輸入行程名稱"
                          value={tripTitle}
                          onChange={(event) => setTripTitle(event.target.value)}
                          required
                        />
                        <div className="modal-action">
                          <button
                            type="button"
                            className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                            onClick={closeModal}
                          >
                            取消
                          </button>
                          <button
                            type="submit"
                            className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                          >
                            完成
                          </button>
                        </div>
                      </div>
                    </form>
                  </dialog>
                )}
                <div className="w-full mt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-12 justify-items-center sm:justify-items-start">
                    {trips.map((trip) => (
                      <TripCard
                        key={trip.trip_plan_id}
                        trip={trip}
                        isMyTrip={true}
                        onDeleteSuccess={onDeleteSuccess}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        <PageTitle pageTitle={pageTitle} />
        <TripNavigationTab />
        {isLoading ? <Loader /> : recommend}
      </>
    );
  }
}

// if (noContent) {
//   return (
//     <>
//       <TripSidebar />
//       {recomend}
//       <Footer />
//     </>
//   );
// } else {
