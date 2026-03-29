import { useState, useEffect } from 'react';
import OtherTripDetailSidebar from '@/components/trip/sidebars/other-trip-detail-sidebar';
import TripNavigationTab from '@/components/trip/sidebars/trip-navigation-tab';
import OtherContentMorning from '@/components/trip/other-content/blocks/other-content-morning';
import OtherContentNoon from '@/components/trip/other-content/blocks/other-content-noon';
import OtherContentNight from '@/components/trip/other-content/blocks/other-content-night';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import PageTitle from '@/components/page-title';
import { TripService } from '@/services/trip-service';
import { useTripDetail } from '@/hooks/trip/use-trip-detail';

export default function OtherTripdetail({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  const { auth } = useAuth();
  const { trip_plan_id } = router.query;

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const {
    tripDetails,
    tripName,
    isLoading,
  } = useTripDetail(trip_plan_id);

  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 將別人的行程加入我的日曆
  const createOtherContent = async (event) => {
    event.preventDefault();
    if (!selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: '請選擇日期',
        text: '請選擇一個日期來加入您的行程表。',
        background: '#2a303c',
        color: '#ffffff',
        confirmButtonColor: '#a0ff1f',
      });
      return;
    }

    // 重新獲取全天行程詳情以確保資料完整 (這部分也可以從 hook 拿，但 OtherTripDetail 邏輯略有不同)
    try {
      const fullDetails = await TripService.getAlldayDetails(trip_plan_id);
      
      const tripPlanData = {
        tripPlan: {
          user_id: auth.id,
          trip_title: tripName.trip_title,
          trip_content: null,
          trip_description: tripName.trip_description,
          trip_notes: tripName.trip_notes,
          trip_date: selectedDate,
          trip_draft: 0,
          trip_pic: tripName.trip_pic,
        },
        tripDetails: (Array.isArray(fullDetails) ? fullDetails : []).map((detail) => ({
          block: detail.block,
          movie_id: detail.movie_id,
          bar_id: detail.bar_id,
        })),
      };

      const data = await TripService.addOtherPlan(tripPlanData);
      if (data.success) {
        closeModal();
        Swal.fire({
          icon: 'success',
          title: '成功',
          text: `成功將 ${tripName.trip_title} 加入日曆!`,
          background: '#2a303c',
          color: '#ffffff',
          confirmButtonColor: '#a0ff1f',
          customClass: {
            confirmButton: 'text-black font-bold border-none px-6 py-2',
            popup: 'border border-slate-700 rounded-box'
          }
        });
      } else {
        throw new Error(data.error || '添加失敗');
      }
    } catch (error) {
      console.error('Error adding other plan:', error);
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: '無法加入行程，請稍後再試。',
        background: '#2a303c',
        color: '#ffffff',
      });
    }
  };

  if (isLoading) return null;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <PageTitle pageTitle={pageTitle} />
        <TripNavigationTab />
        <OtherTripDetailSidebar tripName={tripName} />
        
        <div className="flex sm:justify-start justify-center items-center w-full py-8">
          <div className="mt-8 mb-8 flex flex-col justify-center items-center gap-8 w-full max-w-5xl px-4">
            <OtherContentMorning trip_plan_id={trip_plan_id} />
            <OtherContentNoon trip_plan_id={trip_plan_id} />
            <OtherContentNight trip_plan_id={trip_plan_id} />
            
            <button
              className="sm:hidden text-black text-lg px-9 py-4 bg-[#a0ff1f] rounded-full border border-black flex justify-center items-center cursor-pointer hover:shadow-xl3 hover:animate-pulse"
              onClick={openModal}
            >
              加入我的日曆
            </button>
          </div>

          <div className="hidden sm:flex flex-col justify-start items-center h-[700px] w-[600px] border border-white rounded-xl">
            <h3 className="mt-3 text-3xl text-white">行程筆記</h3>
            <p className="mt-4 mb-4 text-xl">行程描述</p>
            <div className="w-[550px] h-[200px] border border-white rounded-xl p-4 overflow-y-auto">
              {tripName.trip_description ? (
                <div className="text-center">{tripName.trip_description}</div>
              ) : (
                <p className="text-center text-gray-400">用戶並未為此行程添加細節</p>
              )}
            </div>
            
            <p className="mt-4 mb-4 text-xl">行程筆記</p>
            <div className="w-[550px] h-[300px] border border-white rounded-xl p-4 overflow-y-auto">
              {tripName.trip_notes ? (
                <div className="text-center">{tripName.trip_notes}</div>
              ) : (
                <p className="text-center text-gray-400">用戶並未為此行程添加筆記</p>
              )}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex justify-center pb-12">
          <button
            className="text-black text-lg px-9 py-4 w-[350px] bg-[#a0ff1f] rounded-full border border-black cursor-pointer hover:shadow-xl3 hover:animate-pulse font-bold"
            onClick={openModal}
          >
            加入我的日曆
          </button>
        </div>
      </div>

      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box w-96 bg-[#1a1d23] border border-gray-700">
            <h3 className="font-bold text-lg mb-4 text-white">
              將 <span className="text-[#a0ff1f]">{tripName.trip_title}</span> 加入月曆
            </h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">選擇行程日期</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full bg-black text-white"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button
                className="btn btn-outline border-white text-white hover:bg-gray-700 rounded-full px-8"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                className="btn bg-[#a0ff1f] text-black hover:bg-[#8edb1a] border-none rounded-full px-8"
                onClick={createOtherContent}
              >
                完成
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/60" onClick={closeModal}></div>
        </dialog>
      )}
    </>
  );
}
