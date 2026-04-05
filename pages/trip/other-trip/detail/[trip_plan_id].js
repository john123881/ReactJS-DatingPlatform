import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { TripService } from '@/services/trip-service';
import { useTripDetail } from '@/hooks/trip/use-trip-detail';
import { toast } from '@/lib/toast';
import PageTitle from '@/components/page-title';
import TripNavigationTab from '@/components/trip/sidebars/trip-navigation-tab';
import OtherTripDetailSidebar from '@/components/trip/sidebars/other-trip-detail-sidebar';
import OtherContentMorning from '@/components/trip/other-content/blocks/other-content-morning';
import OtherContentNoon from '@/components/trip/other-content/blocks/other-content-noon';
import OtherContentNight from '@/components/trip/other-content/blocks/other-content-night';
import PageLoader from '@/components/ui/loader/page-loader';
import Loader from '@/components/ui/loader/loader';
import SharedTripWorkspace from '@/components/trip/other-content/shared-trip-workspace';

export default function OtherTripdetail({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  const { auth, isAuthLoaded, setLoginModalToggle } = useAuth();
  const { trip_plan_id } = router.query;

  // 設置頁面標題
  useEffect(() => {
    onPageChange?.(pageTitle);
  }, [onPageChange, pageTitle]);

  // Auth Guard
  useEffect(() => {
    if (isAuthLoaded && auth.id === 0) {
      setLoginModalToggle(true);
    }
  }, [isAuthLoaded, auth.id, setLoginModalToggle]);

  const {
    tripDetails,
    tripName,
    newDetail,
    barPhotos,
    barNames,
    moviePhotos,
    isLoading,
  } = useTripDetail(trip_plan_id);

  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const createOtherContent = async (event) => {
    event.preventDefault();
    if (!selectedDate) {
      toast.warning('請選擇日期', '請選擇一個日期來加入您的行程表。');
      return;
    }

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
        toast.success(`成功加入日曆: ${tripName.trip_title}`);
      } else {
        throw new Error(data.error || '添加失敗');
      }
    } catch (error) {
      console.error('Error adding other plan:', error);
      toast.error('失敗', '無法加入行程，請稍後再試。');
    }
  };

  if (!isAuthLoaded) {
    return <Loader text="確認登入狀態中..." minHeight="80vh" />;
  }

  if (auth.id === 0) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      <PageTitle pageTitle={pageTitle} />
      <TripNavigationTab />
      
      <OtherTripDetailSidebar tripName={tripName || {}} isLoading={isLoading} />
      
      <div className="flex-grow">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[600px] animate__animated animate__fadeIn">
            <PageLoader type="index" />
            <p className="mt-4 text-white/50 text-xl">正在準備行程分享內容...</p>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row justify-center items-start w-full max-w-[1700px] py-6 sm:py-12 mx-auto px-4 sm:px-10 gap-10 lg:gap-24 transition-all duration-500 animate__animated animate__fadeIn relative">
            
            {/* Vertical Timeline Background Line */}
            <div className="absolute left-[34px] sm:left-[58px] top-40 bottom-40 w-[1px] bg-gradient-to-b from-transparent via-neongreen/20 to-transparent hidden sm:block"></div>

            {/* 中間：時段內容 */}
            <div className="flex flex-col gap-24 w-full xl:flex-grow max-w-4xl order-2 xl:order-1 relative z-10">
              
              {/* Morning Section */}
              <section className="relative group/section">
                <div className="flex items-start gap-6 mb-10 transition-transform duration-500 group-hover/section:translate-x-2">
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-8 h-8 rounded-full border-2 border-neongreen flex items-center justify-center bg-black shadow-[0_0_15px_#39FF14] transition-all duration-500 group-hover/section:scale-125">
                      <div className="w-2 h-2 bg-neongreen rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-0.5 h-full bg-gradient-to-b from-neongreen via-white/5 to-transparent absolute top-10 -z-10"></div>
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-white text-3xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none">Morning</h2>
                      <span className="text-neongreen font-black text-xs sm:text-sm tracking-[0.4em] uppercase opacity-60">08:00</span>
                    </div>
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em] mt-3 bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block">台北之晨：開始美好的一天</p>
                  </div>
                </div>
                <OtherContentMorning trip_plan_id={trip_plan_id} newDetail={newDetail} barPhotos={barPhotos} barNames={barNames} moviePhotos={moviePhotos} />
              </section>

              {/* Noon Section */}
              <section className="relative group/section">
                <div className="flex items-start gap-6 mb-10 transition-transform duration-500 group-hover/section:translate-x-2">
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center bg-black transition-all duration-500 group-hover/section:border-neongreen group-hover/section:scale-125 group-hover/section:shadow-[0_0_15px_#39FF14]">
                      <div className="w-2 h-2 bg-white/20 rounded-full group-hover/section:bg-neongreen group-hover/section:animate-pulse"></div>
                    </div>
                    <div className="w-0.5 h-full bg-gradient-to-b from-white/10 via-white/5 to-transparent absolute top-10 -z-10"></div>
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-white text-3xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none">Noon</h2>
                      <span className="text-white/20 font-black text-xs sm:text-sm tracking-[0.4em] uppercase group-hover/section:text-neongreen group-hover/section:opacity-60 transition-colors">13:00</span>
                    </div>
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em] mt-3 bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block">午後時光：探索城市角落</p>
                  </div>
                </div>
                <OtherContentNoon trip_plan_id={trip_plan_id} newDetail={newDetail} barPhotos={barPhotos} barNames={barNames} moviePhotos={moviePhotos} />
              </section>

              {/* Night Section */}
              <section className="relative group/section">
                <div className="flex items-start gap-6 mb-10 transition-transform duration-500 group-hover/section:translate-x-2">
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center bg-black transition-all duration-500 group-hover/section:border-neongreen group-hover/section:scale-125 group-hover/section:shadow-[0_0_15px_#39FF14]">
                      <div className="w-2 h-2 bg-white/20 rounded-full group-hover/section:bg-neongreen group-hover/section:animate-pulse"></div>
                    </div>
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-white text-3xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none">Night</h2>
                      <span className="text-white/20 font-black text-xs sm:text-sm tracking-[0.4em] uppercase group-hover/section:text-neongreen group-hover/section:opacity-60 transition-colors">18:00</span>
                    </div>
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em] mt-3 bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block">璀璨之夜：享受浪漫微醺</p>
                  </div>
                </div>
                <OtherContentNight trip_plan_id={trip_plan_id} newDetail={newDetail} barPhotos={barPhotos} barNames={barNames} moviePhotos={moviePhotos} />
              </section>
            </div>

            {/* 右側：整合式工作區 */}
            <div className="w-full xl:w-[480px] flex-shrink-0 order-1 xl:order-2 xl:sticky xl:top-32 z-10">
              <SharedTripWorkspace
                tripName={tripName}
                onJoinClick={openModal}
              />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box w-96 bg-[#1a1d23] border border-gray-700 shadow-2xl rounded-2xl">
            <h3 className="font-bold text-lg mb-4 text-white">
              將 <span className="text-[#a0ff1f]">{tripName?.trip_title}</span> 加入月曆
            </h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">選擇行程日期</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full bg-black text-white border-white/20 focus:border-neongreen"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button
                className="btn btn-outline border-white text-white hover:bg-white hover:text-black rounded-full px-8"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                className="btn bg-[#a0ff1f] text-black hover:bg-[#8edb1a] border-none rounded-full px-8 shadow-glow-green"
                onClick={createOtherContent}
              >
                完成
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/60" onClick={closeModal}></div>
        </dialog>
      )}
    </div>
  );
}
