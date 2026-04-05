import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import MyTripDetailSidebar from '@/components/trip/sidebars/my-trip-detail-sidebar';
import TripNavigationTab from '@/components/trip/sidebars/trip-navigation-tab';
import ContentMorning from '@/components/trip/my-content/blocks/content-morning';
import ContentNoon from '@/components/trip/my-content/blocks/content-noon';
import ContentNight from '@/components/trip/my-content/blocks/content-night';
import BarPhotoCarousel from '@/components/trip/carousel/bar-photo-carousel';
import MoviePhotoCarousel from '@/components/trip/carousel/movie-photo-carousel';
import PageTitle from '@/components/page-title';
import PageLoader from '@/components/ui/loader/page-loader';
import { useTripDetail } from '@/hooks/trip/use-trip-detail';
import { useAuth } from '@/context/auth-context';
import Loader from '@/components/ui/loader/loader';
import MyTripWorkspace from '@/components/trip/my-content/my-trip-workspace';

export default function MyTripDetail({ onPageChange }) {
  const router = useRouter();
  const { auth, isAuthLoaded, setLoginModalToggle } = useAuth();
  const { trip_plan_id } = router.query;

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
    setNewDetail,
    barPhotos,
    barNames,
    moviePhotos,
    isLoading,
    refresh: refreshAllDetails,
  } = useTripDetail(trip_plan_id);

  const pageTitle = '行程規劃';
  useEffect(() => {
    onPageChange?.(pageTitle);
  }, [onPageChange, pageTitle]);

  useEffect(() => {
    if (trip_plan_id === 'undefined') {
      router.replace('/trip/my-trip');
    }
  }, [trip_plan_id, router]);

  if (!isAuthLoaded) {
    return <Loader text="確認登入狀態中..." minHeight="80vh" />;
  }

  if (auth.id === 0) {
    return null;
  }

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
        <TripNavigationTab />
        <MyTripDetailSidebar
          tripName={tripName}
          refreshTripDetails={refreshAllDetails}
        />

        {isLoading ? (
          <div className="flex flex-col flex-grow justify-center items-center h-[600px] animate__animated animate__fadeIn">
            <PageLoader type="index" />
            <p className="mt-4 text-white/50 text-xl">正在準備您的行程細節...</p>
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
                  <ContentMorning
                    newDetail={newDetail}
                    setNewDetail={setNewDetail}
                    tripDetails={tripDetails}
                    trip_plan_id={trip_plan_id}
                    refreshAllDetails={refreshAllDetails}
                    barPhotos={barPhotos}
                    barNames={barNames}
                    moviePhotos={moviePhotos}
                  />
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
                  <ContentNoon
                    newDetail={newDetail}
                    setNewDetail={setNewDetail}
                    tripDetails={tripDetails}
                    trip_plan_id={trip_plan_id}
                    refreshAllDetails={refreshAllDetails}
                    barPhotos={barPhotos}
                    barNames={barNames}
                    moviePhotos={moviePhotos}
                  />
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
                  <ContentNight
                    newDetail={newDetail}
                    setNewDetail={setNewDetail}
                    tripDetails={tripDetails}
                    trip_plan_id={trip_plan_id}
                    refreshAllDetails={refreshAllDetails}
                    barPhotos={barPhotos}
                    barNames={barNames}
                    moviePhotos={moviePhotos}
                  />
                </section>
              </div>

              {/* 右側：整合式工作區 (筆記 + 推薦) */}
              <div className="w-full xl:w-[480px] flex-shrink-0 order-1 xl:order-2 xl:sticky xl:top-32 z-10">
                <MyTripWorkspace
                  tripName={tripName}
                  onUpdateSuccess={refreshAllDetails}
                  trip_plan_id={trip_plan_id}
                  newDetail={newDetail}
                  refreshAllDetails={refreshAllDetails}
                />
              </div>

            </div>
        )}
      </div>
    </>
  );
}
