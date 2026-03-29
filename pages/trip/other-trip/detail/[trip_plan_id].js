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
        
        <div className="flex flex-col lg:flex-row justify-start items-start w-full py-16 max-w-screen-2xl mx-auto px-6 sm:px-12 gap-16 transition-all duration-300">
          {/* 左側：時段內容 */}
          <div className="flex flex-col gap-16 w-full lg:flex-grow order-2 lg:order-1 max-w-6xl pb-20">
            <OtherContentMorning trip_plan_id={trip_plan_id} newDetail={newDetail} />
            <OtherContentNoon trip_plan_id={trip_plan_id} newDetail={newDetail} />
            <OtherContentNight trip_plan_id={trip_plan_id} newDetail={newDetail} />
          </div>

          {/* 右側：行程細節 (Sidebar) */}
          <div className="flex flex-col justify-start items-center h-auto w-full lg:w-[450px] border border-white/10 rounded-3xl py-12 px-8 flex-shrink-0 bg-white/5 backdrop-blur-3xl shadow-2xl order-1 lg:order-2">
            <h3 className="mb-10 text-4xl font-black text-neongreen text-center tracking-tighter">行程細節</h3>
            
            <div className="w-full mb-10">
              <p className="mb-4 text-2xl font-bold border-l-4 border-neongreen pl-4 text-white">行程描述</p>
              <div className="w-full min-h-[120px] max-h-[250px] border border-white/10 rounded-2xl p-6 overflow-y-auto bg-black/40 text-lg leading-relaxed text-gray-300">
                {tripName.trip_description ? (
                  <div>{tripName.trip_description}</div>
                ) : (
                  <p className="text-gray-500 italic text-center py-4 text-sm">此行程尚未填寫描述</p>
                )}
              </div>
            </div>
            
            <div className="w-full mb-12 flex-grow">
              <p className="mb-4 text-2xl font-bold border-l-4 border-neongreen pl-4 text-white">行程筆記</p>
              <div className="w-full min-h-[150px] max-h-[300px] border border-white/10 rounded-2xl p-6 overflow-y-auto bg-black/40 text-lg leading-relaxed text-gray-300">
                {tripName.trip_notes ? (
                  <div>{tripName.trip_notes}</div>
                ) : (
                  <p className="text-gray-500 italic text-center py-4 text-sm">此行程尚未填寫筆記</p>
                )}
              </div>
            </div>

            <button
              className="group relative flex items-center justify-center w-full bg-neongreen hover:bg-white text-black font-black text-2xl py-6 rounded-2xl transition-all duration-300 shadow-glow-green hover:shadow-glow-white overflow-hidden"
              onClick={openModal}
            >
              <span className="relative z-10">加入我的日曆</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
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
